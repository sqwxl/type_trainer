import React from "react"
import Keyboard from "./Keyboard/Keyboard"
import { TextDisplay } from "./TextDisplay/TextDisplay"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import Toolbar from "./Toolbar/Toolbar"
import { Container } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"

import FontSizeSelect from "./Toolbar/FontSizeSelet"
import StringOptionsForm from "./Toolbar/StringOptionsForm"
import { isChar, Timer } from "../utils/utils"
import QuickStats from "./Toolbar/QuickStats"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import Courses, { Course, CourseLevel } from "../utils/Courses"
import { TrainingStringGenerator } from "../utils/TrainingStringGenerator/TrainingStringGenerator"
import LayoutUtil, { CharacterType, CharSet } from "../utils/LayoutUtil"
import { enUsQwerty } from "../assets/Layouts/en_US"
import { modifyRawTrainingWord } from "../utils/TrainingStringModifier/TrainingStringModifier"

enum MachineState {
  Loaded = "LOADED",
  SessionReady = "READY",
  Paused = "PAUSED",
  Training = "TRAINING",
}

const FontSizes: { [key: number]: string } = { 0: "1rem", 1: "1.5rem", 2: "2rem" }

export interface WordModifierOptions {
  caps: boolean
  punct: boolean
  syms: boolean
  nums: boolean
}

export interface TrainingStringOptions {
  wordLength: { minLength: number; maxLength: number }
  letters: boolean
  spaces: boolean
  wordModifierOptions: WordModifierOptions,
  modifyingLikelyhood: number
  wordsPerString: number
}
export const defaultTrainingStringOptions: TrainingStringOptions = {
  wordLength: { minLength: 3, maxLength: 12 },
  letters: true,
  spaces: true,
  wordModifierOptions: {
    caps: false,
    punct: false,
    syms: false,
    nums: false,
  },
  modifyingLikelyhood: 0.8,
  wordsPerString: 6,
}

interface Settings {
  layout: LayoutUtil
  UI: {
    theme: { [index: string]: CSSCustomProperties }
    fontSize: number
  }
  course: Course
  trainingStringOptions: TrainingStringOptions
}
const defaultSettings: Settings = {
  UI: { theme: themes.dark, fontSize: 1 },
  layout: new LayoutUtil(enUsQwerty),
  course: Courses.fingers,
  trainingStringOptions: defaultTrainingStringOptions,
}

interface State {
  pressed: Set<string>
  machineState: MachineState
  trainingWords: string[]
  trainingString: string
  cursor: number
  mistakeCharIndexes: Set<number> // todo: mistakenCharacterIndexes
  courseLevelIndex: 0
  stats: {
    wpm: number
    mistakeCount: number
    totalSessions: number
    averages: {
      wpm: number
      mistakeCount: number // mistakeCount
    }
  }
  settings: Settings
}

export const defaultState: State = {
  trainingWords: [],
  trainingString: "",
  cursor: 0,
  mistakeCharIndexes: new Set(),
  courseLevelIndex: 0,
  stats: {
    wpm: 0,
    mistakeCount: 0,
    totalSessions: 0,
    averages: { wpm: 0, mistakeCount: 0 },
  },
  pressed: new Set(),
  machineState: MachineState.Loaded,
  settings: { ...defaultSettings },
}

interface Props {
  generator: TrainingStringGenerator
}

const inactivityDelay = 2000 //todo: mettre dans settings

export class TypeTrainer extends React.Component<Props, State> {
  static contextType = ThemeContext
  sessionTimer = Timer()
  inactivityTimer = 0

  constructor(props: Props) {
    super(props)
    this.state = defaultState
    this.routeEvent = this.routeEvent.bind(this)
  }

  startInactivityTimer(): number {
    return setTimeout(() => this.routeEvent(new Event("blur")), inactivityDelay)
  }
  componentDidMount(): void {
    document.addEventListener("keydown", this.routeEvent)
    document.addEventListener("keyup", this.routeEvent)
    document.addEventListener("blur", this.routeEvent)
    this.prepareNewSession()
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.routeEvent)
    document.removeEventListener("keyup", this.routeEvent)
    document.removeEventListener("blur", this.routeEvent)
  }

  routeEvent(event: Event): void {
    const machineState = this.state.machineState
    switch (event.type) {
      case "keydown":
        switch (machineState) {
          case MachineState.Training:
          case MachineState.SessionReady:
            this.handleKeyDown(event as KeyboardEvent)
            this.resetInactivityTimer()
            break
          case MachineState.Paused:
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

  private resetInactivityTimer(): void {
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
        state.mistakeCharIndexes.add(state.cursor)
      }
    }

    // Update state
    this.setState(state, () => {
      if (this.state.machineState === MachineState.SessionReady) {
        this.startSession()
      }
    })
  }

  private isEOF(state: State): boolean {
    return state.cursor === state.trainingString.length
  }

  private goToNextChar(state: State): void {
    state.cursor += 1
  }

  private isCorrectCharPressed(state: State, event: KeyboardEvent): boolean {
    return state.trainingString[state.cursor] === event.key
  }

  private shouldKeepKeyDownEvent(event: KeyboardEvent, state: State): boolean {
    return !event.repeat && !state.pressed.has(event.code)
  }

  handleKeyUp(event: KeyboardEvent): void {
    event.preventDefault()
    const pressed = this.state.pressed
    pressed.delete(event.code)
    this.setState({ pressed: pressed })
  }

  logStatus(): void {
    console.info("Status: " + this.state.machineState)
    console.info("Training string: " + this.state.trainingString)
  }

  startSession(): void {
    this.sessionTimer.start()
    this.setState({ machineState: MachineState.Training }, () => this.logStatus())
  }

  pauseSession(): void {
    // Record pause start time
    if (this.sessionTimer != null) this.sessionTimer.pause()
    this.setState({ pressed: new Set(), machineState: MachineState.Paused }, () => this.logStatus())
  }

  unPauseSession(event: Event): void {
    // Translate timer variable forward
    this.sessionTimer.unPause()
    this.setState({ machineState: MachineState.Training }, () => {
      this.logStatus()
      this.routeEvent(event)
    })
  }

  endSession(): void {
    // Computes sessions stats and passes baton to this.startNewSession
    const sessionStats = { ...this.state.stats }
    const minutes = this.sessionTimer.getTimeElapsed() / 1000 / 60

    // Calculate words per minute
    const words = this.state.trainingString.length / 5
    const wpm = Math.round(words / minutes)
    sessionStats.wpm = wpm

    sessionStats.mistakeCount = this.state.mistakeCharIndexes.size
    // Calculate mistakes per session
    sessionStats.totalSessions += 1
    sessionStats.averages.wpm = Math.round(
      (sessionStats.averages.wpm * (sessionStats.totalSessions - 1) + sessionStats.wpm) / sessionStats.totalSessions
    )
    sessionStats.averages.mistakeCount = Math.round(
      (sessionStats.averages.mistakeCount * (sessionStats.totalSessions - 1) + sessionStats.mistakeCount) /
        sessionStats.totalSessions
    )

    this.setState(
      {
        stats: sessionStats,
      },
      () => this.prepareNewSession()
    )
  }

  prepareNewSession(): void {
    const words = this.newTrainingWords()
    const modifiedWords = words.map(word =>
      modifyRawTrainingWord(
        word,
        this.state.settings.trainingStringOptions.wordModifierOptions,
        this.state.settings.layout.charSet.subSet({ trainingLevel: this.getCurrentLevel() }),
        this.state.settings.trainingStringOptions.modifyingLikelyhood
      )
    )
    const string = modifiedWords.join(this.state.settings.trainingStringOptions.spaces ? " " : "")
    this.setState(
      {
        cursor: 0,
        trainingWords: words,
        trainingString: string,
        mistakeCharIndexes: new Set(),
        machineState: MachineState.SessionReady,
      },
      () => this.logStatus()
    )
  }

  private getCurrentLevel(): CourseLevel {
    return this.state.settings.course.levels[this.state.courseLevelIndex]
  }

  private newTrainingWords(): string[] {
    return this.props.generator.generate(
      this.state.settings.trainingStringOptions,
      CharSet.uniqueChars(
        this.state.settings.layout.charSet.subSet({
          trainingLevel: this.getCurrentLevel(),
          type: CharacterType.LOWERCASE_LETTER,
        })
      )
    )
  }

  toggleTheme(): void {
    const settings = { ...this.state.settings }
    settings.UI.theme = settings.UI.theme === themes.light ? themes.dark : themes.light
    this.setState({ settings: settings })
  }

  toggleFontSize(): void {
    const settings = { ...this.state.settings }
    settings.UI.fontSize = (settings.UI.fontSize + 1) % 3
    this.setState({ settings: settings })
  }

  setStringLength(length: string): void {
    const settings = { ...this.state.settings }
    settings.trainingStringOptions.wordsPerString = parseInt(length)
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  changeTrainingStringOptions(trainingStringOptions: TrainingStringOptions): void {
    const options = { ...trainingStringOptions }    
    if (!options.letters) options.wordModifierOptions.caps = false
    const settings = { ...this.state.settings }
    settings.trainingStringOptions = options
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  render(): JSX.Element {
    return (
      <ThemeContext.Provider
        value={{ theme: this.state.settings.UI.theme, toggleTheme: (): void => this.toggleTheme() }}
      >
        <Container fluid className="App" style={this.state.settings.UI.theme}>
          {
            <Toolbar
              left={<QuickStats sessionStats={this.state.stats} />}
              right={[
                <StringOptionsForm
                  key={"optionsForm"}
                  trainingStringOptions={this.state.settings.trainingStringOptions}
                  updateFn={(updatedOptions: TrainingStringOptions): void => this.changeTrainingStringOptions(updatedOptions)}
                />,
                <FontSizeSelect key={"fontSelect"} toggleFn={(): void => this.toggleFontSize()} />,
                <ThemeToggleSwitch key={"themeToggle"} />,
              ]}
            ></Toolbar>
          }
          <Container>
            {
              <TextDisplay style={{ fontSize: FontSizes[this.state.settings.UI.fontSize] }}>
                <FormattedText
                  greyed={this.state.machineState === MachineState.Paused}
                  cursor={this.state.cursor}
                  trainingString={this.state.trainingString}
                  mistakeCharIndexes={this.state.mistakeCharIndexes}
                />
              </TextDisplay>
            }
            {
              <Keyboard
                visualKB={this.state.settings.layout.visualKB}
                pressed={this.state.pressed}
                active={CharSet.uniqueKeyCodes(
                  this.state.settings.layout.charSet.subSet({
                    trainingLevel: this.getCurrentLevel(),
                  })
                )}
                current={this.state.settings.layout.charSet.keyCodeFromChar(this.state.trainingString[this.state.cursor])}
              />
            }
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
