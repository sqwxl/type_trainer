import React from "react"
import Keyboard from "./Keyboard/Keyboard"
import { TextDisplay } from "./TextDisplay/TextDisplay"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import Toolbar from "./Toolbar/Toolbar"
import { Container } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"
import dict from "../english_words_array.json"
import FontSizeSelect from "./Toolbar/FontSizeSelet"
import CharacterCheckboxForm from "./Toolbar/CharacterCheckboxForm"
import { applyMaskToCharSet, generateTrainingString, isChar, Timer } from "../utils/utils"
import QuickStats from "./Toolbar/QuickStats"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import { characterSets, FingerZone, FingerZoneChars } from "./Contexts/LayoutContext/layouts"
import MarkovChain from "../utils/MarkovChain"

const chain = new MarkovChain(3, dict.dict)
enum Paradigm {
  Loaded = "LOADED",
  SessionReady = "READY",
  Paused = "PAUSED",
  Training = "TRAINING",
}

const TrainingLevels: Array<FingerZone[]> = [
  [FingerZone.t, FingerZone.i],
  [FingerZone.t, FingerZone.i, FingerZone.m],
  [FingerZone.t, FingerZone.i, FingerZone.m, FingerZone.r],
  [FingerZone.t, FingerZone.i, FingerZone.m, FingerZone.r, FingerZone.p],
]

const FontSizes: { [key: number]: string } = { 0: "1rem", 1: "1.5rem", 2: "2rem" }
const defaultSettings = {
  UI: { theme: themes.dark, fontSize: 1 },
  session: {
    markov: { minLength: 3, maxLength: 12 },
    characters: {
      letters: true,
      caps: false,
      punct: false,
      syms: false,
      nums: false,
      spaces: true,
    },
    wordsPerString: 4,
    trainingLevel: 0,
  },
}

interface State {
  pressed: Set<string>
  paradigm: Paradigm
  trainingString: string
  cursor: number
  mistakes: Set<number>
  sessionStats: {
    wpm: number
    mistakes: number
    totalSessions: number
    averages: {
      wpm: number
      mistakes: number
    }
  }
  settings: {
    UI: {
      theme: { [index: string]: CSSCustomProperties }
      fontSize: number
    }
    session: {
      markov : { minLength: number, maxLength: number }
      characters: {
        letters: boolean
        caps: boolean
        punct: boolean
        syms: boolean
        nums: boolean
        spaces: boolean
      }
      wordsPerString: number
      trainingLevel: number
    }
  }
}

const inactivityDelay = 2000

export class TypeTrainer extends React.Component<{}, State> {
  static contextType = ThemeContext
  sessionTimer = Timer()
  inactivityTimer!: number
  constructor(props: any) {
    super(props)
    this.state = {
      trainingString: "",
      cursor: 0,
      mistakes: new Set(),
      sessionStats: {
        wpm: 0,
        mistakes: 0,
        totalSessions: 0,
        averages: { wpm: 0, mistakes: 0 },
      },
      pressed: new Set(),
      paradigm: Paradigm.Loaded,
      settings: { ...defaultSettings },
    }
  }

  startInactivityTimer() {
    return setTimeout(() => this.routeEvent(new Event("blur")), inactivityDelay)
  }
  componentDidMount() {
    document.addEventListener("keydown", e => this.routeEvent(e))
    document.addEventListener("keyup", e => this.routeEvent(e))
    document.addEventListener("blur", e => this.routeEvent(e))
    this.prepareNewSession()
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", e => this.routeEvent(e))
    document.removeEventListener("keyup", e => this.routeEvent(e))
    document.removeEventListener("blur", e => this.routeEvent(e))
  }

  routeEvent(event: Event) {
    let paradigm = this.state.paradigm
    switch (event.type) {
      case "keydown":
        switch (paradigm) {
          case Paradigm.Training:
          case Paradigm.SessionReady:
            this.handleKeyDown(event as KeyboardEvent)
            clearTimeout(this.inactivityTimer)
            this.inactivityTimer = this.startInactivityTimer()
            break
          case Paradigm.Paused:
            this.unPauseSession(event)
            break
          default:
            break
        }
        break
      case "keyup":
        this.handleKeyUp(event as KeyboardEvent)
        break
      case "blur":
        this.pauseSession()
        break
      default:
        break
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    event.preventDefault()
    const state = { ...this.state }
    // Reject input
    if (event.repeat || state.pressed.has(event.code)) {
      return
    }
    state.pressed.add(event.code)

    // Validate
    if (isChar(event.code)) {
      if (state.trainingString[state.cursor] === event.key) {
        state.cursor += 1
        if (state.cursor === state.trainingString.length) {
          this.endSession()
          return
        }
      } else {
        state.mistakes.add(state.cursor)
      }
    }

    // Update state
    this.setState(state, () => {
      if (this.state.paradigm === Paradigm.SessionReady) {
        this.startSession()
      }
    })
  }

  handleKeyUp(event: KeyboardEvent) {
    event.preventDefault()
    let pressed = this.state.pressed
    pressed.delete(event.code)
    this.setState({ pressed: pressed })
  }

  logStatus() {
    console.info("Status: " + this.state.paradigm)
  }

  startSession() {
    this.sessionTimer.start()
    this.setState({ paradigm: Paradigm.Training }, () => this.logStatus())
  }

  pauseSession() {
    // Record pause start time
    if (this.sessionTimer != null) this.sessionTimer.pause()
    this.setState({ pressed: new Set(), paradigm: Paradigm.Paused }, () => this.logStatus())
  }

  unPauseSession(event: Event) {
    // Translate timer variable forward
    this.sessionTimer.unPause()
    this.setState({ paradigm: Paradigm.Training }, () => {
      this.logStatus()
      this.routeEvent(event)
    })
  }

  endSession() {
    // Computes sessions stats and passes baton to this.startNewSession
    let sessionStats = { ...this.state.sessionStats }
    let minutes = this.sessionTimer.getTimeElapsed() / 1000 / 60

    // Calculate words per minute
    let words = this.state.trainingString.length / 5
    let wpm = Math.round(words / minutes)
    sessionStats.wpm = wpm

    sessionStats.mistakes = this.state.mistakes.size
    // Calculate mistakes per session
    sessionStats.totalSessions += 1
    sessionStats.averages.wpm = Math.round(
      (sessionStats.averages.wpm * (sessionStats.totalSessions - 1) + sessionStats.wpm) / sessionStats.totalSessions
    )
    sessionStats.averages.mistakes = Math.round(
      (sessionStats.averages.mistakes * (sessionStats.totalSessions - 1) + sessionStats.mistakes) /
        sessionStats.totalSessions
    )

    this.setState(
      {
        sessionStats: sessionStats,
      },
      () => this.prepareNewSession()
    )
  }

  prepareNewSession() {

    let mask = TrainingLevels[this.state.settings.session.trainingLevel].reduce((keys: Array<string>, fz: FingerZone) => {
      return keys.concat(FingerZoneChars[fz as string])
    }, [])
    const charSets = applyMaskToCharSet(characterSets, mask)
    
    this.setState(
      {
        cursor: 0,
        trainingString: generateTrainingString(chain, this.state.settings.session, charSets),
        mistakes: new Set(),
        paradigm: Paradigm.SessionReady,
      },
      () => this.logStatus()
    )
  }

  toggleTheme() {
    let settings = { ...this.state.settings }
    settings.UI.theme = settings.UI.theme === themes.light ? themes.dark : themes.light
    this.setState({ settings: settings })
  }

  toggleFontSize() {
    let settings = { ...this.state.settings }
    settings.UI.fontSize = (settings.UI.fontSize + 1) % 3
    this.setState({ settings: settings })
  }

  setStringLength(length: string) {
    let settings = { ...this.state.settings }
    settings.session.wordsPerString = parseInt(length)
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  changeSessionSettings(sessionSettings: any) {
    let session = { ...sessionSettings }
    if (!session.characters.letters) session.characters.caps = false
    let settings = { ...this.state.settings }
    settings.session = session
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  render() {
    return (
      <ThemeContext.Provider value={{ theme: this.state.settings.UI.theme, toggleTheme: () => this.toggleTheme() }}>
        <Container fluid className="App" style={this.state.settings.UI.theme}>
          <Toolbar
            left={<QuickStats sessionStats={this.state.sessionStats} />}
            right={[
              <CharacterCheckboxForm
                sessionSettings={this.state.settings.session}
                updateFn={(settings: any) => this.changeSessionSettings(settings)}
              />,
              <FontSizeSelect toggleFn={() => this.toggleFontSize()} />,
              <ThemeToggleSwitch />,
            ]}
          ></Toolbar>
          <Container>
            <TextDisplay style={{ fontSize: FontSizes[this.state.settings.UI.fontSize] }}>
              <FormattedText
                greyed={this.state.paradigm === Paradigm.Paused}
                cursor={this.state.cursor}
                trainingString={this.state.trainingString}
                mistakes={this.state.mistakes}
              />
            </TextDisplay>
            <Keyboard
              pressed={this.state.pressed}
              keyZones={TrainingLevels[this.state.settings.session.trainingLevel]}
            />
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
