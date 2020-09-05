import React from "react"
import Keyboard from "./Keyboard/Keyboard"
import { TextDisplay } from "./TextDisplay/TextDisplay"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import Toolbar from "./Toolbar/Toolbar"
import { Container } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"
import Foswig from "foswig"
import dict from "../english_words_array.json"
import FontSizeSelect from "./Toolbar/FontSizeSelet"
import CharacterCheckboxForm from "./Toolbar/CharacterCheckboxForm"
import { isChar, isVowel, Timer } from "../utils/utils"
import QuickStats from "./Toolbar/QuickStats"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import StringLengthSelect from "./Toolbar/SringLengthSelect"

const chain = new Foswig(3, dict.dict)
const options = { minLength: 3, maxLength: 12 }
enum Paradigm {
  Loaded = "LOADED",
  SessionReady = "READY",
  Paused = "PAUSED",
  Training = "TRAINING",
}

const FontSizes: { [key: number]: string } = { 0: "1rem", 1: "1.5rem", 2: "2rem" }
const defaultSettings = {
  UI: { theme: themes.dark, fontSize: 1 },
  session: {
    characters: {
      letters: true,
      caps: false,
      punct: false,
      syms: false,
      nums: false,
      spaces: true,
    },
    wordsPerString: 4,
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
      characters: {
        letters: boolean
        caps: boolean
        punct: boolean
        syms: boolean
        nums: boolean
        spaces: boolean
      }
      wordsPerString: number
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
    this.setState(
      {
        cursor: 0,
        trainingString: this.generateTrainingString(),
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

  updateStringCharacterSettings(obj: any) {
    if (!obj.letters) {
      obj.caps = false
    }
    let settings = { ...this.state.settings }
    settings.session.characters = { ...obj }
    this.setState({ settings: settings }, () => this.setState({ trainingString: this.generateTrainingString() }))
  }

  setStringLength(length: string) {
    let settings = { ...this.state.settings }
    settings.session.wordsPerString = parseInt(length)
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  generateTrainingString() {
    if (Object.values(this.state.settings.session.characters).every(v => !v)) return ""
    let { letters, caps, punct, syms, nums, spaces } = this.state.settings.session.characters
    let words: Array<string> = []

    enum Kind {
      "punctual",
      "splitting",
      "surrounding",
    }
    interface CharacterSet {
      kind: Kind
      chars: Array<string | string[]>
      weight: number
    }

    const punctuation: Array<CharacterSet> = [
      {
        kind: Kind.punctual,
        chars: [",", ".", "?", "!", ";", ":", "'s"],
        weight: 5,
      },
      {
        kind: Kind.surrounding,
        chars: [["'"], ['"'], ["(", ")"]],
        weight: 5,
      },
      {
        kind: Kind.splitting,
        chars: ["'", "-"],
        weight: 5,
      },
    ]

    const symbols: Array<CharacterSet> = [
      {
        kind: Kind.punctual,
        chars: ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "=", "+", "\\", "|", "<", ">", "/"],
        weight: 8,
      },
      {
        kind: Kind.surrounding,
        chars: [["'"], ['"'], ["(", ")"], ["[", "]"], ["{ ", " }"], ["<", ">"]],
        weight: 6,
      },
      {
        kind: Kind.splitting,
        chars: [".", "@", "_", "\\", "/"],
        weight: 5,
      },
    ]

    const numbers: Array<CharacterSet> = [
      {
        kind: Kind.punctual,
        chars: ["0", "1", "3", "4", "5", "6", "7", "9"],
        weight: 5,
      },
    ]

    const modifyingLikelyhood = 0.8
    let willApply = () => Math.random() * modifyingLikelyhood

    while (words.length < this.state.settings.session.wordsPerString) {
      let word = letters ? chain.generate(options) : ""
      if (caps && willApply()) word = word.slice(0, 1).toUpperCase().concat(word.slice(1))
      if (punct && willApply()) word = symbolize(word, punctuation)
      if (syms && willApply()) word = symbolize(word, symbols)
      if (nums && willApply()) word = symbolize(word, numbers)
      words.push(word)
    }

    return words.join(spaces ? " " : "")

    function symbolize(str: string, symbols: Array<CharacterSet>): string {
      // Relative likelihoods of different types of punctuation
      const weights = symbols.reduce((a, c) => a.concat([c.weight]), [] as number[])
      let loto = Math.round(Math.random() * weights.reduce((a, c) => c + a))
      let type = 0
      let sum = 0
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i]
        if (loto <= sum) {
          type = i
          break
        }
      }
      let symbolized = str
      let { kind, chars } = symbols[type]
      let s = chars[Math.floor(Math.random() * chars.length)]
      switch (kind) {
        case Kind.punctual: // punctuating
          if (s instanceof Array) s = s[0]
          symbolized = str.concat(s)
          break
        case Kind.surrounding: // surounding
          symbolized = s[0].concat(str, s[1] || s[0])
          break
        case Kind.splitting: // splitting
          if (str.length < 5) break
          let split = 0
          // Try to split somewhere after 2nd and before 2nd-to-last letters -- not between two vowels
          for (let i = 2; i < str.length - 3; i++) {
            if (!isVowel(str[i]) && !isVowel(str[i + 1])) {
              split = i
              break
            }
          }
          if (split === 0) break
          if (s instanceof Array) s = s[0]
          symbolized = str.slice(0, split).concat(s, str.slice(split))
          break
        default:
          break
      }
      return symbolized
    }
  }

  render() {
    return (
      <ThemeContext.Provider value={{ theme: this.state.settings.UI.theme, toggleTheme: () => this.toggleTheme() }}>
        <Container
          fluid
          className="App"
          style={this.state.settings.UI.theme}
        >
          <Container>
            <Toolbar
              left={<QuickStats sessionStats={this.state.sessionStats} />}
              right={[
                <CharacterCheckboxForm
                  characters={this.state.settings.session.characters}
                  setCharacters={(settings: any) => this.updateStringCharacterSettings(settings)}
                />,
                <StringLengthSelect
                  value={this.state.settings.session.wordsPerString}
                  updateFn={(s: string) => this.setStringLength(s)}
                />,
                <FontSizeSelect toggleFn={() => this.toggleFontSize()} />,
                <ThemeToggleSwitch />,
              ]}
            ></Toolbar>
            <TextDisplay style={{ fontSize: FontSizes[this.state.settings.UI.fontSize] }}>
              <FormattedText
                greyed={this.state.paradigm === Paradigm.Paused}
                cursor={this.state.cursor}
                trainingString={this.state.trainingString}
                mistakes={this.state.mistakes}
              />
            </TextDisplay>
            <Keyboard pressed={this.state.pressed} />
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
