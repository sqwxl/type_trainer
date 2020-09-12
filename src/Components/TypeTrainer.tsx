import React from "react"
import Keyboard from "./Keyboard/Keyboard"
import { TextDisplay } from "./TextDisplay/TextDisplay"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import Toolbar from "./Toolbar/Toolbar"
import { Container } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"

import FontSizeSelect from "./Toolbar/FontSizeSelet"
import CharacterCheckboxForm from "./Toolbar/CharacterCheckboxForm"
import { applyMaskToCharSet, generateTrainingString, isChar, Timer } from "../utils/utils"
import QuickStats from "./Toolbar/QuickStats"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import { characterSets } from "../Layouts/layouts"
import MarkovChain from "../utils/MarkovChain"
import { getCharactersPerFinger } from "../utils/training"
import { TrainingLevels } from "../utils/models"
import { newTrainingStringGenerator, TrainingStringGenerator } from "../utils/TrainingStringGenerator"


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
    trainingLevel: 0, //todo: trainingLevelIndex
  },
}

export interface SessionOptions {
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
  trainingLevel: number ////todo: trainingLevelIndex
}

interface State {
  pressed: Set<string>
  paradigm: Paradigm
  trainingString: string
  cursor: number
  mistakes: Set<number> // todo: mistakenCharacterIndexes
  sessionStats: {
    wpm: number 
    mistakes: number //todo: mistakeCount
    totalSessions: number
    averages: {
      wpm: number
      mistakes: number // mistakeCount
    }
  }
  settings: {
    UI: {
      theme: { [index: string]: CSSCustomProperties }
      fontSize: number
    }
    session: SessionOptions
  }
}

interface Props {
  generator: TrainingStringGenerator
}

const inactivityDelay = 2000 //todo: mettre dans settings

export class TypeTrainer extends React.Component<Props, State> {
  static contextType = ThemeContext
  sessionTimer = Timer()
  inactivityTimer: number = 0

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
    this.routeEvent = this.routeEvent.bind(this)
  }

  startInactivityTimer() {
    return setTimeout(() => this.routeEvent(new Event("blur")), inactivityDelay)
  }
  componentDidMount() {
    document.addEventListener("keydown", this.routeEvent)
    document.addEventListener("keyup", this.routeEvent)
    document.addEventListener("blur", this.routeEvent)
    this.prepareNewSession()
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.routeEvent)
    document.removeEventListener("keyup", this.routeEvent)
    document.removeEventListener("blur", this.routeEvent)
  }

  routeEvent(event: Event): void {
    let paradigm = this.state.paradigm
    switch (event.type) {
      case "keydown":
        switch (paradigm) {
          case Paradigm.Training:
          case Paradigm.SessionReady:
            this.handleKeyDown(event as KeyboardEvent)
            this.resetInactivityTimer()
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

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimer)
    this.inactivityTimer = this.startInactivityTimer()
  }

  handleKeyDown(event: KeyboardEvent): void {
    event.preventDefault()
    const state = { ...this.state }
    // Reject input
    if (!this.shouldKeepKeyDownEvent(event, state)) {
      return
    }
    state.pressed.add(event.code)

    // Validate
    if (isChar(event.code)) {
      if (this.isCorrectCharPressed(state, event)) {
        this.goToNextChar(state)
        if (this.isEOF(state)) {
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

  private isEOF(state: State) {
    return state.cursor === state.trainingString.length
  }

  private goToNextChar(state: State) {
    state.cursor += 1
  }

  private isCorrectCharPressed(state: State, event: KeyboardEvent) {
    return state.trainingString[state.cursor] === event.key
  }

  private shouldKeepKeyDownEvent(event: KeyboardEvent, state: State) {
    return !event.repeat && !state.pressed.has(event.code)
  }

  handleKeyUp(event: KeyboardEvent): void {
    event.preventDefault()
    let pressed = this.state.pressed
    pressed.delete(event.code)
    this.setState({ pressed: pressed })
  }

  logStatus(): void {
    console.info("Status: " + this.state.paradigm)
  }

  startSession(): void {
    this.sessionTimer.start()
    this.setState({ paradigm: Paradigm.Training }, () => this.logStatus())
  }

  pauseSession(): void {
    // Record pause start time
    if (this.sessionTimer != null) this.sessionTimer.pause()
    this.setState({ pressed: new Set(), paradigm: Paradigm.Paused }, () => this.logStatus())
  }

  unPauseSession(event: Event): void {
    // Translate timer variable forward
    this.sessionTimer.unPause()
    this.setState({ paradigm: Paradigm.Training }, () => {
      this.logStatus()
      this.routeEvent(event)
    })
  }

  endSession(): void {
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

  prepareNewSession(): void {
    this.setState(
      {
        cursor: 0,
        trainingString: this.props.generator.generate(this.state.settings.session),
        mistakes: new Set(),
        paradigm: Paradigm.SessionReady,
      },
      () => this.logStatus()
    )
  }

  toggleTheme(): void {
    let settings = { ...this.state.settings }
    settings.UI.theme = settings.UI.theme === themes.light ? themes.dark : themes.light
    this.setState({ settings: settings })
  }

  toggleFontSize(): void {
    let settings = { ...this.state.settings }
    settings.UI.fontSize = (settings.UI.fontSize + 1) % 3
    this.setState({ settings: settings })
  }

  setStringLength(length: string): void {
    let settings = { ...this.state.settings }
    settings.session.wordsPerString = parseInt(length)
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  changeSessionSettings(sessionSettings: any): void {
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
          {/* <Toolbar
            left={<QuickStats sessionStats={this.state.sessionStats} />}
            right={[
              <CharacterCheckboxForm
                sessionSettings={this.state.settings.session}
                updateFn={(settings: any) => this.changeSessionSettings(settings)}
              />,
              <FontSizeSelect toggleFn={() => this.toggleFontSize()} />,
              <ThemeToggleSwitch />,
            ]}
          ></Toolbar> */}
          <Container>
           {/*  <TextDisplay style={{ fontSize: FontSizes[this.state.settings.UI.fontSize] }}>
              <FormattedText
                greyed={this.state.paradigm === Paradigm.Paused}
                cursor={this.state.cursor}
                trainingString={this.state.trainingString}
                mistakes={this.state.mistakes}
              />
            </TextDisplay> */}
            {/* <Keyboard
              pressed={this.state.pressed}
              keyZones={TrainingLevels[this.state.settings.session.trainingLevel]}
            /> */}
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
