import React from "react"
import { CourseLevel } from "../assets/courses/Courses"
import { Hand, Finger } from "../core/Keyboard"
import { KeyCode } from "../core/KeyCode"
import {
  TrainingStringGenerator,
  GuidedModeStringGenerator,
  PracticeModeStringGenerator,
  CodeModeStringGenerator,
} from "../core/TrainingStringGenerator/TrainingStringGenerator"
import { Timer } from "../utils/Timer"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import defaultState, {
  inactivityDelay,
  TrainingMode,
  FontSizes,
  MachineState,
  State,
} from "./defaultState"

// CHILDREN
import { Container, Button, ButtonGroup } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import VirtualKeyboard from "./VirtualKeyboard/VirtualKeyboard"
import ModeSelectorModal from "./Modals/ModeSelectorModal/ModeSelectorModal"
import SettingsModal from "./Modals/SettingsModal/SettingsModal"
import TextDisplay from "./TextDisplay/TextDisplay"
import FontSizeToggle from "./Toolbar/FontSizeToggle"
import QuickStats from "./Toolbar/QuickStats"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"
import Toolbar from "./Toolbar/Toolbar"
import Keyboard from "../core/Keyboard"

export class TypeTrainer extends React.Component<{}, State> {
  static contextType = ThemeContext
  sessionTimer = Timer()
  inactivityTimer = 0

  constructor(props: any) {
    super(props)
    this.state = defaultState
    this.routeEvent = this.routeEvent.bind(this)
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
          case "SETTINGS":
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

  startInactivityTimer(): number {
    return setTimeout(() => this.routeEvent(new Event("blur")), inactivityDelay)
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
    state.currentUserPressedKeys.add(event.code)
    // console.log("code: ", event.code, "key: ", event.key)
    // Validate
    if (Keyboard.keyCodeisCharKey(event.code)) {
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

  setModeModalShow(value: boolean): void {
    this.setState({ uiModeSelectShow: value }, () => {
      if (value) this.pauseSession("SETTINGS")
    })
  }

  setSettingsModalShow(value: boolean): void {
    this.setState({ uiSettingsModalShow: value }, () => {
      if (value) this.pauseSession("SETTINGS")
    })
  }

  setTrainingMode(mode: TrainingMode = this.state.trainingMode): void {
    const newGenerator = this.newTrainingStringGenerator(mode)
    this.setState({ trainingMode: mode, trainingStringGenerator: newGenerator }, () =>
      this.prepareNewSession()
    )
  }

  newTrainingStringGenerator(mode: TrainingMode = this.state.trainingMode): TrainingStringGenerator {
    let generator: TrainingStringGenerator
    switch (mode) {
      case TrainingMode.GUIDED:
        generator = new GuidedModeStringGenerator(this.state.language, this.state.guidedCourse)
        break
      case TrainingMode.PRACTICE:
        generator = new PracticeModeStringGenerator(this.state.language, this.state.practiceSourceText)
        break
      case TrainingMode.CODE:
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
    return !event.repeat && !state.currentUserPressedKeys.has(event.code)
  }

  handleKeyUp(event: KeyboardEvent): void {
    event.preventDefault()
    const pressed = this.state.currentUserPressedKeys
    pressed.delete(event.code)
    this.setState({ currentUserPressedKeys: pressed })
  }

  logStatus(): void {
    console.info("Status: " + this.state.machineState)
  }

  startSession(): void {
    this.sessionTimer.start()
    this.setState({ machineState: "TRAINING" }, () => this.logStatus())
  }

  pauseSession(state: MachineState = "PAUSED"): void {
    if (this.sessionTimer != null) this.sessionTimer.pause()
    this.setState({ currentUserPressedKeys: new Set(), machineState: state }, () => this.logStatus())
  }

  unPauseSession(event: Event): void {
    this.sessionTimer.unPause()
    this.setState({ machineState: "TRAINING" }, () => {
      this.logStatus()
      this.routeEvent(event)
    })
  }

  endSession(): void {
    const totalSessions = this.state.totalSessions + 1
    
    const wordsPerMinute = this.wordsPerMinute()
    const wordsPerMinuteAverage = Math.round(
      (this.state.wordsPerMinuteAverage * this.state.totalSessions + wordsPerMinute) / totalSessions
    )

    const successRate = Math.round(100 * (1 - this.state.mistakeCharIndices.size / this.state.trainingString.length))
    const successRateAverage = Math.round(
      (this.state.successRate * this.state.totalSessions + successRate) / totalSessions
    )

    this.setState({ totalSessions, wordsPerMinute, wordsPerMinuteAverage, successRate, successRateAverage }, () =>
      this.prepareNewSession()
    )
  }

  private wordsPerMinute(): number {
    const minutes = this.sessionTimer.getTimeElapsed() / 1000 / 60
    const conventionalWordLength = 5
    const sentenceLength = this.state.trainingString.length
    const words = sentenceLength / conventionalWordLength
    if (words < 1 && minutes < 1 / 60) return 40 // sloppy patch to avoid ridiculous values
    const wpm = Math.round(words / minutes)
    return wpm
  }

  prepareNewSession(newState: any = {}): void {
    if (newState.practiceSourceText != null) {
      newState.trainingStringGenerator = new PracticeModeStringGenerator(this.state.language, newState.practiceSourceText)
      newState.trainingString = newState.trainingStringGenerator.generate()
    } else {
      newState.trainingString = this.state.trainingStringGenerator.generate()
    }
    if (newState.cursor == null) newState.cursor = 0
    if (newState.mistakeCharIndices == null) newState.mistakeCharIndices = new Set()

    this.setState(state => ({...state, ...newState, machineState: 'READY'}),
      () => this.logStatus()
    )
  }

  private getCurrentLevel(): CourseLevel {
    return this.state.guidedCourse.levels[this.state.guidedLevelIndex]
  }

  toggleTheme(): void {
    this.setState({ uiTheme: this.state.uiTheme === themes.light ? themes.dark : themes.light })
  }

  toggleFontSize(): void {
    this.setState({ trainingStringFontSize: (this.state.trainingStringFontSize + 1) % 3 }) // TODO: remove magic number
  }

  currentActiveKeyCodes(): KeyCode[] {
    if (this.state.trainingMode === TrainingMode.GUIDED) {
      const keyboard = this.state.keyboard
      const { keyBoardRows: rows, hand, fingers } = this.getCurrentLevel()
      let active: KeyCode[] = []
      const activeRows = rows.map(row => keyboard.layout[row])
      activeRows.forEach(row => {
        active = active.concat(
          row
            .filter(keyCap => {
              const belongsToHand = hand === Hand.ANY || hand === keyCap.fingerHand.hand
              const belongsToFingers = fingers === [Finger.ANY] || fingers.includes(keyCap.fingerHand.finger)

              return belongsToHand && belongsToFingers
            })
            .map(keyCap => keyCap.code)
        )
      })
      return active
    } else {
      return this.state.language.uniqueKeyCodes
    }
  }

  applyUserSettings(settings: any) {
    this.prepareNewSession(settings)
  }

  render(): JSX.Element {
    return (
      <ThemeContext.Provider value={{ theme: this.state.uiTheme, toggleTheme: (): void => this.toggleTheme() }}>
        <ModeSelectorModal
          show={this.state.uiModeSelectShow}
          onHide={() => this.setModeModalShow(false)}
          settrainingmode={(mode: TrainingMode): void => this.setTrainingMode(mode)}
        ></ModeSelectorModal>
        <SettingsModal
          show={this.state.uiSettingsModalShow}
          onHide={() => this.setSettingsModalShow(false)}
          settings={{ ...this.state }}
          onSubmitChanges={settings => this.applyUserSettings(settings)}
        ></SettingsModal>
        <Container fluid className="App" style={this.state.uiTheme}>
          <Toolbar
            stats={<QuickStats key="quickStats" {...this.state} />}
            buttons={
              <ButtonGroup aria-label="App settings">
                <Button key="openModeSelectModalBtn" variant="primary" onClick={() => this.setModeModalShow(true)}>
                  {this.state.trainingMode}
                </Button>
                <Button key="openSettingsModalBtn" onClick={() => this.setSettingsModalShow(true)}>
                  Settings
                </Button>
                <FontSizeToggle key={"fontSelect"} toggleFn={(): void => this.toggleFontSize()} />
              </ButtonGroup>
            }
          />
          <Container>
            <TextDisplay style={{ fontSize: FontSizes[this.state.trainingStringFontSize] }}>
              <FormattedText
                greyed={this.state.machineState === "PAUSED"}
                cursor={this.state.cursor}
                trainingString={this.state.trainingString}
                mistakeCharIndices={this.state.mistakeCharIndices}
              />
            </TextDisplay>

            <VirtualKeyboard
              layout={this.state.keyboard}
              pressed={this.state.currentUserPressedKeys}
              active={this.currentActiveKeyCodes()}
              currentKey={this.state.language.characterSet.mapGlyphToKeyCode(
                this.state.trainingString[this.state.cursor]
              )}
            >
              <ThemeToggleSwitch key={"themeToggle"} />
            </VirtualKeyboard>
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
