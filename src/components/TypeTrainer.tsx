import React from "react"
import VirtualKeyboard from "./Keyboard/VirtualKeyboard"
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
import { CourseLevel } from "../assets/courses/Courses"
import {
  CodeModeStringGenerator,
  GuidedModeStringGenerator,
  PracticeModeStringGenerator,
  TrainingStringGenerator,
} from "../core/TrainingStringGenerator/TrainingStringGenerator"
import ModeSelectorModal from "./Modals/ModeSelectorModal/ModeSelectorModal"
import Button from "react-bootstrap/Button"
import SettingsModal from "./Modals/SettingsModal/SettingsModal"
import {
  State,
  defaultState,
  inactivityDelay,
  defaultGuidedModeStringGeneratorOptions,
  defaultPracticeModeStringOptions,
  defaultCodeModeStringOptions,
  FontSizes,
} from "./defaultState"
import { StringGeneratorOptions } from "../core/TrainingStringGenerator/StringGeneratorOption"
import { KeyCode } from "../core/KeyCode"
import { Finger, Hand } from "../core/Keyboard"

export type MachineState = "LOADED" | "READY" | "PAUSED" | "TRAINING"

export enum TrainingMode {
  Guided = "Guided Mode",
  Practice = "Practice Mode",
  Code = "Code Mode",
}

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
          case "TRAINING":
          case "READY":
            this.handleKeyDown(event as KeyboardEvent)
            this.resetInactivityTimer()
            break
          case "PAUSED":
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
    console.log("code: ", event.code, "key: ", event.key)
    // Validate
    if (isChar(event.code)) {
      if (TypeTrainer.isCorrectCharPressed(state, event)) {
        TypeTrainer.goToNextChar(state)
        if (TypeTrainer.isEOF(state)) {
          this.endSession()
          return
        }
      } else {
        state.mistakeCharIndices.add(state.cursor)
      }
    }

    // Update state
    this.setState(state, () => {
      if (this.state.machineState === "READY") {
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
    this.setState({ modeSelectShow: false, trainingMode: mode, generator: newGenerator, settings: newSettings }, () =>
      this.prepareNewSession()
    )
  }

  setSettingsModalShow(value: boolean): void {
    this.setState({ settingsModalShow: value }, () => {
      if (value) this.pauseSession()
    })
  }

  newStringOptionsBasedOnMode(mode: TrainingMode): StringGeneratorOptions {
    let options: StringGeneratorOptions
    // TODO: check local storage for user options, else load defaults
    switch (mode) {
      case TrainingMode.Guided:
        options = defaultGuidedModeStringGeneratorOptions
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
        generator = new GuidedModeStringGenerator(this.state.settings.language.dictionary)
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
    if (event.key === "Enter") return state.trainingString[state.cursor] === "\n"
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
    this.setState({ machineState: "TRAINING" }, () => this.logStatus())
  }

  pauseSession(): void {
    // Record pause start time
    if (this.sessionTimer != null) this.sessionTimer.pause()
    this.setState({ pressed: new Set(), machineState: "PAUSED" }, () => this.logStatus())
  }

  unPauseSession(event: Event): void {
    // Translate timer variable forward
    this.sessionTimer.unPause()
    this.setState({ machineState: "TRAINING" }, () => {
      this.logStatus()
      this.routeEvent(event)
    })
  }

  endSession(): void {
    // Computes sessions stats and passes baton to this.startNewSession
    // Calculate words per minute
    const sessionStats = { ...this.state.stats }

    sessionStats.wpm = this.wordsPerMinute(sessionStats)

    sessionStats.mistakeCount = this.state.mistakeCharIndices.size
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

  private wordsPerMinute(sessionStats: {
    wpm: number
    mistakeCount: number
    totalSessions: number
    averages: { wpm: number; mistakeCount: number }
  }) {
    const minutes = this.sessionTimer.getTimeElapsed() / 1000 / 60
    const conventionalWordLength = 5
    const words = this.state.trainingString.length / conventionalWordLength
    return Math.round(words / minutes)
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
        mistakeCharIndices: new Set(),
        machineState: "READY",
      },
      () => this.logStatus()
    )
  }

  private getCurrentLevel(): CourseLevel {
    return this.state.settings.course.levels[this.state.courseLevelIndex]
  }

  private guidedModeText(): string {
    const generator = this.state.generator as GuidedModeStringGenerator
    const options = this.state.settings.stringOptions
    return generator.generate(options, this.state.settings.keyboard, this.getCurrentLevel())
  }

  private practiceModeText(): string {
    const generator = this.state.generator as PracticeModeStringGenerator
    const options = this.state.settings.stringOptions
    return generator.generate(options)
  }

  private codeModeText(): string {
    const generator = this.state.generator as CodeModeStringGenerator
    const options = this.state.settings.stringOptions
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

  changeTrainingStringOptions(trainingStringOptions: StringGeneratorOptions): void {
    const settings = { ...this.state.settings }
    settings.stringOptions = { ...trainingStringOptions }
    this.setState({ settings: settings }, () => this.prepareNewSession())
  }

  currentActiveKeyCodes(): KeyCode[] {
    if (this.state.trainingMode === TrainingMode.Guided) {
      const keyboard = this.state.settings.keyboard
      const { keyBoardRows: rows, hand, fingers } = this.getCurrentLevel()
      let active: KeyCode[] = []
      const activeRows = rows.map(row => keyboard.layout[row])
      activeRows.forEach(row => {
        active = active.concat(row.filter(keyCap => {
          const belongsToHand = (hand === Hand.ANY || hand === keyCap.fingerHand.hand)
          const belongsToFingers = ((fingers === [Finger.ANY]) || fingers.includes(keyCap.fingerHand.finger))

          return belongsToHand && belongsToFingers
        }).map(keyCap => keyCap.code))
      })
      return active
    } else {
      return this.state.settings.language.characterSet.uniqueKeyCodes()
    }
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
          updateFn={(updatedOptions: StringGeneratorOptions): void => this.changeTrainingStringOptions(updatedOptions)}
        ></SettingsModal>
        <Container fluid className="App" style={this.state.settings.UI.theme}>
          {
            <Toolbar
              stats={<QuickStats sessionStats={this.state.stats} />}
              buttons={[
                <Button key="openModeSelectModalBtn" variant="primary" onClick={() => this.setModeSelectShow(true)}>
                  {this.state.trainingMode}
                </Button>,
                <div style={{ margin: "0 0.5rem" }} />,
                <Button key="openSettingsModalBtn" onClick={() => this.setSettingsModalShow(true)}>
                  Settings
                </Button>,
                <div style={{ margin: "0 0.5rem" }} />,
                <FontSizeToggle key={"fontSelect"} toggleFn={(): void => this.toggleFontSize()} />,
                <div style={{ margin: "0 0.5rem" }} />,
                <ThemeToggleSwitch key={"themeToggle"} />,
              ]}
            />
          }
          <Container>
            {
              <TextDisplay style={{ fontSize: FontSizes[this.state.settings.UI.fontSize] }}>
                <FormattedText
                  greyed={this.state.machineState === "PAUSED"}
                  cursor={this.state.cursor}
                  trainingString={this.state.trainingString}
                  mistakeCharIndexes={this.state.mistakeCharIndices}
                />
              </TextDisplay>
            }
            {
              <VirtualKeyboard
                layout={this.state.settings.keyboard}
                pressed={this.state.pressed}
                active={this.currentActiveKeyCodes()}
                currentKey={this.state.settings.language.characterSet.mapGlyphToKeyCode(
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
