import React from "react"
import Keyboard from "./Keyboard/Keyboard"
import { TextDisplay } from "./TextDisplay/TextDisplay"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import Toolbar from "./Toolbar/Toolbar"
import { Container } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"
import FontSizeToggle from "./Toolbar/FontSizeSelet"
import { isChar } from "../utils/isChar"
import { Timer } from "../utils/Timer"
import QuickStats from "./Toolbar/QuickStats"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import Courses, { Course, CourseLevel } from "../assets/Courses/Courses"
import { CodeModeStringGenerator, GuidedModeStringGenerator, PracticeModeStringGenerator, TrainingStringGenerator } from "../core/TrainingStringGenerator/TrainingStringGenerator"
import LayoutUtil, { CharSet } from "../core/LayoutUtil"
import enUsQwerty from "../assets/Layouts/en_US"
import ModeSelectorModal from "./Modals/ModeSelectorModal/ModeSelectorModal"
import Button from "react-bootstrap/Button"
import SettingsModal from "./Modals/SettingsModal/SettingsModal"
import text from '../assets/Texts/state_and_revolution'
import { dict } from '../assets/Dictionaries/english.json'

const stateRev = text // TODO: Make generic

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

export interface StringOptions {

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

export interface GuidedModeStringOptions extends StringOptions {
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

export interface PracticeModeStringOptions extends StringOptions {
  source: string
  fullSentences: boolean
  wordsPerString: number
}



const defaultPracticeModeStringOptions: PracticeModeStringOptions = {
  source: stateRev,
  fullSentences: true,
  wordsPerString: 6
}

export enum CodingLanguage {
  'JS' = 'JavaScript',
  'TS' = 'TypeScript',
  'C' = 'C',
  'Bash' = 'Bash',
  'Python' = 'Python'
}

export interface CodeModeStringOptions extends StringOptions {
  language: CodingLanguage
  lines: number
}

export const defaultCodeModeStringOptions = {
  language: CodingLanguage.JS,
  lines: 6
}


interface Settings {
  layout: LayoutUtil
  UI: {
    theme: { [index: string]: CSSCustomProperties }
    fontSize: number
  }
  course: Course
  stringOptions: StringOptions
}

const defaultSettings: Settings = {
  UI: { theme: themes.dark, fontSize: 1 },
  layout: new LayoutUtil(enUsQwerty),
  course: Courses.guidedCourse,
  stringOptions: defaultPracticeModeStringOptions
}

interface State {
  modeSelectShow: boolean
  settingsModalShow: boolean
  trainingMode: TrainingMode
  generator: TrainingStringGenerator
  pressed: Set<string>
  machineState: MachineState
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

const defaultGenerator = new PracticeModeStringGenerator()

export const defaultState: State = {
  modeSelectShow: false,
  settingsModalShow: false,
  trainingMode: TrainingMode.Practice,
  generator: defaultGenerator,
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


const inactivityDelay = 2000 //todo: mettre dans settings

export class TypeTrainer extends React.Component<{}, State> {
  static contextType = ThemeContext
  sessionTimer = Timer()
  inactivityTimer = 0

  constructor(props: any) {
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
    const newStringOptions = this.newStringOptionsBasedOnMode(mode)
    const newSettings = this.state.settings
    newSettings.stringOptions = newStringOptions
    const newGenerator = this.newGeneratorBasedOnMode(mode)
    this.setState({ modeSelectShow: false, trainingMode: mode, generator: newGenerator, settings: newSettings }, () => this.prepareNewSession())
  }

  setSettingsModalShow(value: boolean): void {
    this.setState({ settingsModalShow: value }, () => {
      if (value) this.pauseSession()
    })
  }

  newStringOptionsBasedOnMode(mode: TrainingMode): StringOptions {
    let options: StringOptions
    // TODO: check local storage for user options, else load defaults
    switch (mode) {
      case TrainingMode.Guided:
        options = defaultGuidedModeStringOptions
        break
      case TrainingMode.Practice:
        options = defaultPracticeModeStringOptions
        break
      case TrainingMode.Code:
        options = defaultCodeModeStringOptions
        break
    }
    return options
  }

  newGeneratorBasedOnMode(mode: TrainingMode): TrainingStringGenerator {
    let generator: TrainingStringGenerator
    switch (mode) {
      case TrainingMode.Guided:
        generator = new GuidedModeStringGenerator(dict)
        break
      case TrainingMode.Practice:
        generator = new PracticeModeStringGenerator()
        break
      case TrainingMode.Code:
        generator = new CodeModeStringGenerator()
        break
    }
    return generator
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
    let string: string
    switch (trainingMode) {
      case TrainingMode.Guided:
        string = this.guidedModeText()
        break
      case TrainingMode.Practice:
        string = this.practiceModeText()
        break
      case TrainingMode.Code:
        string = this.codeModeText()
        break
      default:
        string = ""
        break
    }
    this.setState(
      {
        cursor: 0,
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

  private guidedModeText(): string {
    const generator = this.state.generator as GuidedModeStringGenerator
    const options = this.state.settings.stringOptions as GuidedModeStringOptions
    return generator.generate(options, this.state.settings.layout, this.getCurrentLevel())
  }

  private practiceModeText(): string {
    const generator = this.state.generator as PracticeModeStringGenerator
    const options = this.state.settings.stringOptions as PracticeModeStringOptions
    return generator.generate(options)
  }

  private codeModeText(): string {
    const generator = this.state.generator as CodeModeStringGenerator
    const options = this.state.settings.stringOptions as CodeModeStringOptions
    return generator.generate(options)
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

  changeTrainingStringOptions(trainingStringOptions: StringOptions): void {
    let stringOptions
    switch (this.state.trainingMode) {
      case TrainingMode.Guided:
        stringOptions = { ...trainingStringOptions } as GuidedModeStringOptions
        if (stringOptions.letters != null && !stringOptions.letters) stringOptions.wordModifierOptions.caps = false
        break
      case TrainingMode.Practice:
        stringOptions = { ...trainingStringOptions } as PracticeModeStringGenerator
        break
      case TrainingMode.Code:
        stringOptions = { ...trainingStringOptions } as CodeModeStringGenerator
        break
    }
    const settings = { ...this.state.settings }
    settings.stringOptions = stringOptions
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  render(): JSX.Element {
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
          mode={this.state.trainingMode}
          trainingStringOptions={this.state.settings.stringOptions}
          updateFn={(updatedOptions: StringOptions): void => this.changeTrainingStringOptions(updatedOptions)}
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
