import React from "react"
import Keyboard from "./Keyboard/Keyboard"
import { TextDisplay } from "./TextDisplay/TextDisplay"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import Toolbar from "./Toolbar/Toolbar"
import { Container } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"

import FontSizeToggle from "./Toolbar/FontSizeSelet"
import { isChar, Timer } from "../utils/utils"
import QuickStats from "./Toolbar/QuickStats"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import Courses, { Course, CourseLevel } from "../utils/Courses"
import { TrainingStringGenerator } from "../utils/TrainingStringGenerator/TrainingStringGenerator"
import LayoutUtil, { CharacterType, CharSet } from "../utils/LayoutUtil"
import enUsQwerty from "../assets/Layouts/en_US"
import { modifyWord } from "../utils/modifyWord/modifyWord"
import ModeSelectorModal from "./Modals/ModeSelectorModal/ModeSelectorModal"
import Button from "react-bootstrap/Button"
import SettingsModal from "./Modals/SettingsModal/SettingsModal"

/*
TODO:
 3 main options:
  - Guided course: for complete beginners
  - Custom text practice: for users who just want to practice
  - Code: for programmers
 */

enum MachineState {
  Loaded = "LOADED",
  SessionReady = "READY",
  Paused = "PAUSED",
  Training = "TRAINING",
}

export enum TrainingMode {
  Guided = "Guided Mode",
  Practice = "Practice Mode",
  Code = "Code Mode",
}

const FontSizes: { [key: number]: string } = {
  0: "1rem",
  1: "1.5rem",
  2: "2rem",
}

export interface WordModifierOptions {
  caps: boolean
  punct: boolean
  syms: boolean
  nums: boolean
  prog: boolean
}

export const defaultWordModifierOptions: WordModifierOptions = {
  caps: false,
  punct: false,
  syms: false,
  nums: false,
  prog: false,
}

export interface GuidedModeStringOptions {
  wordLength: { minLength: number; maxLength: number }
  letters: boolean
  spaces: boolean
  wordModifierOptions: WordModifierOptions
  modifyingLikelihood: number
  wordsPerString: number
}

export const defaultGuidedModeStringOptions: GuidedModeStringOptions = {
  wordLength: { minLength: 3, maxLength: 12 },
  letters: true,
  spaces: true,
  wordModifierOptions: defaultWordModifierOptions,
  modifyingLikelihood: 0.8,
  wordsPerString: 6,
}

export interface PracticeModeStringOptions {
  source: string
  fullSentences: boolean
  wordsPerString: 6
}

export enum CodingLanguage {
  'JS' = 'JavaScript',
  'TS' = 'TypeScript',
  'C' = 'C',
  'Bash' = 'Bash',
  'Python' = 'Python'
}

export interface CodeModeStringOptions {
  language: CodingLanguage
  lines: 5
}

interface Settings {
  layout: LayoutUtil
  UI: {
    theme: { [index: string]: CSSCustomProperties }
    fontSize: number
  }
  course: Course
  stringOptions: GuidedModeStringOptions | PracticeModeStringOptions | CodeModeStringOptions
}

const defaultSettings: Settings = {
  UI: { theme: themes.dark, fontSize: 1 },
  layout: new LayoutUtil(enUsQwerty),
  course: Courses.guidedCourse,
  stringOptions: defaultGuidedModeStringOptions,
}

interface State {
  modeSelectShow: boolean
  settingsModalShow: boolean
  trainingMode: TrainingMode
  pressed: Set<string>
  machineState: MachineState
  trainingWords: string[]
  trainingString: string
  cursor: number
  mistakeCharIndexes: Set<number>
  courseLevelIndex: number
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
  modeSelectShow: false,
  settingsModalShow: false,
  trainingMode: TrainingMode.Practice,
  trainingWords: [],
  trainingString: "",
  cursor: 0,
  mistakeCharIndexes: new Set(),
  courseLevelIndex: 33,
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
    if (!TypeTrainer.shouldKeepKeyDownEvent(event, state)) {
      return
    }
    state.pressed.add(event.code)

    // Validate
    if (isChar(event.code)) {
      if (TypeTrainer.isCorrectCharPressed(state, event)) {
        TypeTrainer.goToNextChar(state)
        if (TypeTrainer.isEOF(state)) {
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

  setModeSelectShow(value: boolean): void {
    this.setState({ modeSelectShow: value }, () => {
      if (value) this.pauseSession()
    })
  }

  setTrainingMode(mode: TrainingMode): void {
    this.setState({ modeSelectShow: false, trainingMode: mode }, () => this.prepareNewSession())
  }

  setSettingsModalShow(value: boolean): void {
    this.setState({ settingsModalShow: value }, () => {
      if (value) this.pauseSession()
    })
  }

  private static isEOF(state: State): boolean {
    return state.cursor === state.trainingString.length
  }

  private static goToNextChar(state: State): void {
    state.cursor += 1
  }

  private static isCorrectCharPressed(state: State, event: KeyboardEvent): boolean {
    return state.trainingString[state.cursor] === event.key
  }

  private static shouldKeepKeyDownEvent(event: KeyboardEvent, state: State): boolean {
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
    // Calculate words per minute
    const sessionStats = { ...this.state.stats },
      minutes = this.sessionTimer.getTimeElapsed() / 1000 / 60,
      words = this.state.trainingString.length / 5
    sessionStats.wpm = Math.round(words / minutes)

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
    const { trainingMode } = this.state
    const { wordModifierOptions, modifyingLikelihood, spaces } = this.state.settings.stringOptions
    const charSet = this.state.settings.layout.charSet
    let words: string[]
    let string: string
    switch (trainingMode) {
      case TrainingMode.Guided:
        words = this.guidedCourseWords()
        const modifiedWords = words.map((word) =>
          modifyWord(
            word,
            wordModifierOptions,
            charSet.subSet({
              trainingLevel: this.getCurrentLevel(),
            }),
            modifyingLikelihood
          )
        )
        string = modifiedWords.join(spaces ? " " : "")
        break
      case TrainingMode.Practice:
        words = [""]
        string = this.practiceText()
        break
      case TrainingMode.Code:
        words = [""]
        string = this.codeTextSample()
        break
      default:
        words = [""]
        string = ""
        break
    }
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

  private guidedCourseWords(): string[] {
    const words = this.props.generator.generate(
      this.state.settings.stringOptions,
      CharSet.uniqueChars(
        this.state.settings.layout.charSet.subSet({
          trainingLevel: this.getCurrentLevel(),
          type: CharacterType.LOWERCASE_LETTER,
        })
      )
    )

    return words
  }

  private practiceText(): string {
    const words = "Placeholder example sentence." // TODO: get training string from practice text
    return words
  }

  private codeTextSample(): string {
    const words = "const Placeholder = example(code).toBe('displayed')" // TODO: get training string from code type of choice
    return words
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

  changeTrainingStringOptions(trainingStringOptions: GuidedModeStringOptions): void {
    const options = { ...trainingStringOptions }
    if (!options.letters) options.wordModifierOptions.caps = false
    const settings = { ...this.state.settings }
    settings.stringOptions = options
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  render(): JSX.Element {
    let UI: JSX.Element
    switch (this.state.trainingMode) {
      case TrainingMode.Guided:
        break
      case TrainingMode.Practice:
        break
      case TrainingMode.Code:
        break
      default:
        break
    }
    return (
      <ThemeContext.Provider
        value={{
          theme: this.state.settings.UI.theme,
          toggleTheme: (): void => this.toggleTheme(),
        }}
      >
        <ModeSelectorModal
          show={this.state.modeSelectShow}
          onHide={() => this.setModeSelectShow(false)}
          setTrainingMode={(mode: TrainingMode): void => this.setTrainingMode(mode)}
        ></ModeSelectorModal>
        <SettingsModal
          show={this.state.settingsModalShow}
          onHide={() => this.setSettingsModalShow(false)}
          trainingStringOptions={this.state.settings.stringOptions}
          updateFn={(updatedOptions: GuidedModeStringOptions): void => this.changeTrainingStringOptions(updatedOptions)}
        ></SettingsModal>
        <Container fluid className="App" style={this.state.settings.UI.theme}>
          {
            <Toolbar
              stats={<QuickStats sessionStats={this.state.stats} />}
              buttons={[
                <Button key="openModeSelectModalBtn" variant="primary" onClick={() => this.setModeSelectShow(true)}>
                  {this.state.trainingMode}
                </Button>,
                <div style={{ margin: "0 0.5rem" }}/>,
                <Button key="openSettingsModalBtn" onClick={() => this.setSettingsModalShow(true)}>
                  Settings
                </Button>,
                <div style={{ margin: "0 0.5rem" }}/>,
                <FontSizeToggle key={"fontSelect"} toggleFn={(): void => this.toggleFontSize()} />,
                <div style={{ margin: "0 0.5rem" }}/>,
                <ThemeToggleSwitch key={"themeToggle"} />,
              ]}
            />
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
                current={this.state.settings.layout.charSet.keyCodeFromChar(
                  this.state.trainingString[this.state.cursor]
                )}
              />
            }

            {/* <Form inline>
                <FormLabel htmlFor="courseLevelSelector">Level: </FormLabel>
                <FormControl
                  id="courseLevelSelector"
                  key="course-select"
                  type="number"
                  size="sm"
                  name="wordsPerString"
                  style={{
                    width: "4rem",
                    fontFamily: "'Courier New', Courier, monospace",
                  }}
                  defaultValue={this.state.courseLevelIndex}
                  onChange={({ target: { value } }): void =>
                    this.setState({ courseLevelIndex: parseInt(value) }, () => this.prepareNewSession())
                  }
                />
              </Form> */}
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
