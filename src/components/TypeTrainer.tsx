import React from "react"
import { CourseLevel } from "../assets/courses/Courses"
import { KeyCode } from "../core/KeyCode"
import {
  GuidedModeStringGenerator,
  PracticeModeStringGenerator,
  CodeModeStringGenerator,
  TrainingStringGenerator,
} from "../core/TrainingStringGenerator/TrainingStringGenerator"
import { Timer } from "../utils/Timer"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import defaultState, { inactivityDelay, TrainingMode, FontSizes, MachineState, State } from "./defaultState"

// CHILDREN
import { Container, Button, ButtonGroup } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import VirtualKeyboard from "./VirtualKeyboard/VirtualKeyboard"
import ModeSelectorModal from "./Modals/ModeSelectorModal/ModeSelectorModal"
import SettingsModal from "./Modals/SettingsModal/SettingsModal"
import TextDisplay from "./TextDisplay/TextDisplay"
import FontSizeToggle from "./Toolbar/FontSizeToggle"
import QuickStats from "./Toolbar/QuickStats"
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
    this.prepareNewSession({ trainingMode: mode, machineState: "INIT" })
  }

  private static isEOF(state: State): boolean {
    return state.cursor === state.trainingString.length
  }

  private static goToNextChar(state: State): void {
    state.cursor += 1
  }

  private static isCorrectCharPressed(state: State, event: KeyboardEvent): boolean {
    if (event.key === "Enter") return state.trainingString[state.cursor] === "\n"
    if (event.key === "Tab") return state.trainingString[state.cursor] === "\t"

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

  prepareNewSession(newState: any = {}): void {
    const draftState = { ...this.state, ...newState }
    console.table(draftState)
    if (draftState.machineState === "INIT" || draftState.machineState === "SETTINGS") {
      draftState.trainingStringGenerator = this.newStringGenerator(draftState)
      draftState.trainingString = draftState.trainingStringGenerator.generate(draftState)
    } else {
      draftState.trainingString = this.state.trainingStringGenerator.generate(draftState)
    }

    draftState.cursor = 0
    draftState.mistakeCharIndices = new Set()
    draftState.currentActiveKeyCodes = this.getCurrentActiveKeyCodes(draftState)
    this.setState(
      state => ({ ...state, ...draftState, machineState: "READY" }),
      () => this.logStatus()
    )
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

    const guidedLevelIndex = this.state.trainingMode === TrainingMode.GUIDED ? this.nextLevelIndex(successRate) : this.state.guidedLevelIndexWelc

    this.setState(
      { totalSessions, wordsPerMinute, wordsPerMinuteAverage, successRate, successRateAverage, guidedLevelIndex },
      () => this.prepareNewSession()
    )
  }

  nextLevelIndex(successRate: number) {
    const currentLvl = this.state.guidedLevelIndex
    if (successRate >= 97 && currentLvl < this.state.guidedCourseLevels.length - 1) {
      return currentLvl + 1
    } else if (successRate <= 50 && currentLvl > 0) {
      return currentLvl - 1
    } else {
      return currentLvl
    }
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

  private newStringGenerator(state: any): TrainingStringGenerator {
    const mode = state.trainingMode || this.state.trainingMode
    let generator: TrainingStringGenerator
    switch (mode) {
      case TrainingMode.GUIDED:
        generator = new GuidedModeStringGenerator(
          this.state.keyboard,
          this.state.language,
          this.state.guidedCourseLevels
        )
        break
      case TrainingMode.PRACTICE:
        generator = new PracticeModeStringGenerator(
          this.state.language,
          state.practiceSourceText || this.state.practiceSourceText
        )
        break
      case TrainingMode.CODE:
        generator = new CodeModeStringGenerator(state.codeSourceText || this.state.codeSourceText)
        break
      default:
        generator = this.state.trainingStringGenerator
        break
    }
    return generator
  }

  private getCurrentLevel(): CourseLevel {
    // return final level (full keyboard) if lvl is undefined
    return this.state.guidedCourseLevels[this.state.guidedLevelIndex]
  }

  toggleTheme(): void {
    this.setState({ uiTheme: this.state.uiTheme === themes.light ? themes.dark : themes.light })
  }

  toggleFontSize(): void {
    this.setState({ trainingStringFontSize: (this.state.trainingStringFontSize + 1) % 3 }) // TODO: remove magic number
  }

  toggleWhiteSpaceSymbols(): void {
    this.setState({ uiShowWhiteSpaceSymbols: !this.state.uiShowWhiteSpaceSymbols })
  }

  getCurrentActiveKeyCodes(state: any = {}): KeyCode[] {
    const draftState: State = { ...this.state, ...state }

    // NEW APPROACH: base active keys on current training string
    const keyCodes: KeyCode[] = draftState.trainingString
    .split("")
    .map(glyph => draftState.language.characterSet.mapGlyphToKeyCode(glyph))
    .reduce((arr: KeyCode[], kc) => (arr.includes(kc) ? arr : arr.concat(kc)), [])
    return keyCodes

    // OLD APPROACH: inferring active keys from current level, was too complicated
    // const globalUsedKeyCodes = draftState.language.uniqueKeyCodes
    // if (draftState.trainingMode === TrainingMode.GUIDED) {
    // const noKeyOnlyOfType = (type: CharacterType) => (code: KeyCode): boolean =>
    // draftState.language.characterSet.filterByCode(code).every(ch => ch.type !== type)
    // const keyboard = draftState.keyboard
    // const { keyBoardRows: rows, hand, fingers } = this.getCurrentLevel()
    // let active: KeyCode[] = rows
    //   .reduce((arr: KeyCode[], row) => arr.concat(keyboard.keyCodeLayout[row]), [])
    //   .filter(code => globalUsedKeyCodes.includes(code))
    //   .filter(code => hand === Hand.ANY || hand === keyboard.fingerMap[code].hand)
    //   .filter(code => fingers[0] === Finger.ANY || fingers.includes(keyboard.fingerMap[code].finger))
    //   .filter(noKeyOnlyOfType("WHITESPACE"))

    // if (!draftState.guidedHasPunctuation) {
    //   active = active.filter(noKeyOnlyOfType("PUNCTUATION"))
    // } else {
    //   const punct = CharacterSet.uniqueKeyCodes(draftState.language.characterSet.punctSet)
    //   for (let p of punct) {
    //     if (!active.includes(p)) active.push(p)
    //   }
    // }
    // if (!draftState.guidedHasNumbers) {
    //   active = active.filter(noKeyOnlyOfType("NUMBER"))
    // } else {
    //   const nums = CharacterSet.uniqueKeyCodes(draftState.language.characterSet.numberSet)
    //   for (let n of nums) {
    //     if (!active.includes(n)) active.push(n)
    //   }
    // }
    // if (!draftState.guidedHasSpecials) {
    //   active = active.filter(noKeyOnlyOfType("SPECIAL"))
    // } else {
    //   const spec = CharacterSet.uniqueKeyCodes(draftState.language.characterSet.specialSet)
    //   for (let s of spec) {
    //     if (!active.includes(s)) active.push(s)
    //   }
    // }
    // return active
    // } else {
    //   return globalUsedKeyCodes
    // }
  }

  applyUserSettings(settings: any) {
    this.prepareNewSession({ ...settings })
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
          mode={this.state.trainingMode}
          language={this.state.language}
          guidedWordLength={this.state.guidedWordLength}
          guidedNumWords={this.state.guidedNumWords}
          guidedHasCaps={this.state.guidedHasCaps}
          guidedHasPunctuation={this.state.guidedHasPunctuation}
          guidedHasNumbers={this.state.guidedHasNumbers}
          guidedHasSpecials={this.state.guidedHasSpecials}
          guidedLikelihoodModified={this.state.guidedLikelihoodModified}
          practiceSourceText={this.state.practiceSourceText}
          codeSourceText={this.state.codeSourceText}
          codeLines={this.state.codeLines}
          onSubmitChanges={settings => this.applyUserSettings(settings)}
        ></SettingsModal>
        <Container fluid className="App" style={this.state.uiTheme}>
          <Toolbar
            stats={
              <QuickStats
                key="quickStats"
                {...this.state}
                mode={this.state.trainingMode}
                levelDescription={this.getCurrentLevel().description}
                changeLevel={(lvl: number) =>
                  this.prepareNewSession({ guidedLevelIndex: lvl % this.state.guidedCourseLevels.length })
                }
              />
            }
            buttons={
              <ButtonGroup aria-label="App settings">
                <Button key="openModeSelectModalBtn" onClick={() => this.setModeModalShow(true)}>
                  {this.state.trainingMode}
                </Button>
                <Button key="openSettingsModalBtn" onClick={() => this.setSettingsModalShow(true)}>
                  Settings
                </Button>
                <FontSizeToggle key={"fontSelect"} toggleFn={(): void => this.toggleFontSize()} />
                <Button
                  key="uiShowWhiteSpaceSymbols"
                  onClick={() => this.toggleWhiteSpaceSymbols()}
                  dangerouslySetInnerHTML={
                    this.state.uiShowWhiteSpaceSymbols ? { __html: "<strike>&para;</strike>" } : { __html: "&para;" }
                  }
                ></Button>
                <Button key="toggleTheme" onClick={() => this.toggleTheme()}>
                  {this.state.uiTheme === themes.dark ? "🌞" : "🌛"}
                </Button>
              </ButtonGroup>
            }
          />
          <Container>
            <TextDisplay style={{ fontSize: FontSizes[this.state.trainingStringFontSize] }}>
              <FormattedText
                greyed={this.state.machineState === "PAUSED"}
                mode={this.state.trainingMode}
                cursor={this.state.cursor}
                trainingString={this.state.trainingString}
                mistakeCharIndices={this.state.mistakeCharIndices}
                uiShowWhiteSpaceSymbols={this.state.uiShowWhiteSpaceSymbols}
              />
            </TextDisplay>

            <VirtualKeyboard
              layout={this.state.keyboard}
              pressed={this.state.currentUserPressedKeys}
              active={this.state.currentActiveKeyCodes}
              currentKey={this.state.language.characterSet.mapGlyphToKeyCode(
                this.state.trainingString[this.state.cursor]
              )}
            ></VirtualKeyboard>
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
