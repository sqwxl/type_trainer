import Keyboard from "../core/Keyboard"
import { Language } from "../core/Language"
import { PracticeModeStringGenerator, TrainingStringGenerator } from "../core/TrainingStringGenerator/TrainingStringGenerator"
import TrainingText from "../core/TrainingText"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import { themes } from "./Contexts/ThemeContext/ThemeContext"

import Courses, { Course, CourseLevel } from "../assets/courses/Courses"
import English from "../assets/languages/english/English"
import qwerty from "../assets/keyboard_layouts/en_qwerty"
// import state_and_revolution from "../assets/texts/state_and_revolution"
import { KeyCode } from "../core/KeyCode"

export const FontSizes = ["1rem", "1.5rem", "2.25rem"]
export type MachineState = "INIT" | "LOADED" | "READY" | "PAUSED" | "TRAINING" | "SETTINGS"

export enum TrainingMode {
  GUIDED = "Guided",
  PRACTICE = "Practice",
  CODE = "Code",
}
const defaultLayout = qwerty
const defaultLanguage = English
const practiceWelcomeText = "Welcome to the touch typing trainer! Use the menu above to change training modes. You can also adjust settings for each mode. This is only a demo text, feel free to change it to whatever you like. \nEnjoy!"
const defaultText = new TrainingText(practiceWelcomeText, English)
const defaultMode = TrainingMode.PRACTICE
const defaultGenerator = new PracticeModeStringGenerator(defaultLanguage, defaultText.text)
const defaultCourse = Courses.guidedCourse
const defaultCodeSourceText = String.raw`export class CodeModeStringGenerator implements TrainingStringGenerator {
  private _cursor: number
  private _code: string
  constructor(_code: string) {
    this._code = sanitizeCode(_code)
    this._cursor = 0
  }
  generate(options: any = { codeLines: 4 }): string {
    const lines: string[] = []
    const newLineAt = (idx: number) => this._code[idx] === "\n"

    let cursor = this._cursor
    let start,
      end = 0
    for (let i = 0; i < options.codeLines; i++) {
      start = cursor
      end = this._code.indexOf("\n", start) + 1
      if (end <= 0) end = this._code.length
      const line = this._code.slice(start, end)
      lines.push(line)
      cursor = end
      if (cursor >= this._code.length) break
    }
    this._cursor = cursor
    return lines.join("")
  }
}`


export enum CodeLanguage {
  "JS" = "JavaScript",
  "TS" = "TypeScript",
  "C" = "C",
  "Bash" = "Bash",
  "Python" = "Python",
}

export interface State {
  machineState: MachineState
  currentActiveKeyCodes: KeyCode[]
  currentUserPressedKeys: Set<string>
  trainingStringGenerator: TrainingStringGenerator
  trainingString: string
  cursor: number
  mistakeCharIndices: Set<number>
  wordsPerMinute: number
  successRate: number
  totalSessions: number
  wordsPerMinuteAverage: number
  successRateAverage: number
  uiModeSelectShow: boolean
  uiSettingsModalShow: boolean
  uiShowWhiteSpaceSymbols: boolean
  uiTheme: { [index: string]: CSSCustomProperties }

  language: Language
  keyboard: Keyboard
  trainingMode: TrainingMode
  trainingStringFontSize: number

  guidedCourse: Course
  guidedCourseLevels: CourseLevel[]
  guidedLevelIndex: number
  guidedWordLength: {min: number, max: number}
  guidedNumWords: number
  guidedHasCaps: boolean
  guidedHasPunctuation: boolean
  guidedHasNumbers: boolean
  guidedHasSpecials: boolean
  guidedLikelihoodModified: number

  practiceSourceText: string

  codeSourceText: string
  codeLines: number
}

export const defaultState: State = {
  machineState: "INIT",
  language: defaultLanguage,
  keyboard: defaultLayout,
  trainingMode: defaultMode,
  trainingStringGenerator: defaultGenerator,
  currentActiveKeyCodes: [],
  currentUserPressedKeys: new Set(),
  trainingString: "",
  cursor: 0,
  mistakeCharIndices: new Set(),
  wordsPerMinute: 0,
  successRate: 0,
  totalSessions: 0,
  wordsPerMinuteAverage: 0,
  successRateAverage: 0,
  
  uiModeSelectShow: false,
  uiSettingsModalShow: false,
  uiShowWhiteSpaceSymbols: true,
  
  uiTheme: themes.dark,
  trainingStringFontSize: 1,
  
  guidedCourse: defaultCourse,
  guidedCourseLevels: defaultCourse.levels,
  guidedLevelIndex: 0,
  guidedWordLength: {min:5, max: 12},
  guidedNumWords: 12,
  guidedHasCaps: false,
  guidedHasPunctuation: false,
  guidedHasNumbers: false,
  guidedHasSpecials: false,
  guidedLikelihoodModified: 0.8,

  practiceSourceText: defaultText.text,

  codeSourceText: defaultCodeSourceText,
  codeLines: 4,
}

export const inactivityDelay = 2000 //todo: mettre dans settings

export default defaultState
