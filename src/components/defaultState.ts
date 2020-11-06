import { themes } from "./Contexts/ThemeContext/ThemeContext"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import Courses, { Course } from "../assets/courses/Courses"
import {
  PracticeModeStringGenerator,
  TrainingStringGenerator,
} from "../core/TrainingStringGenerator/TrainingStringGenerator"
import en_qwerty from "../assets/keyboard_layouts/en_qwerty"
import state_and_revolution from "../assets/texts/state_and_revolution"
import English from "../assets/languages/english/English"
import TrainingText from "../core/TrainingText"
import { Language } from "../core/Language"
import Keyboard from "../core/Keyboard"

const defaultLayout = en_qwerty
const defaultLanguage = English
const defaultText = new TrainingText(state_and_revolution, English)
const defaultGenerator = new PracticeModeStringGenerator(defaultText.text)

export const FontSizes = ["1rem", "1.5rem", "3rem"]
export type MachineState = 'INIT' | "LOADED" | "READY" | "PAUSED" | "TRAINING" | "SETTINGS"

export enum TrainingMode {
  GUIDED = "Guided",
  PRACTICE = "Practice",
  CODE = "Code",
}

export const defaultGuidedModeStringGeneratorOptions = {}

export const defaultPracticeModeStringOptions = {
  sourceText: defaultText.text,
  fullSentences: true,
  wordsPerString: 8,
}

export enum CodeLanguage {
  "JS" = "JavaScript",
  "TS" = "TypeScript",
  "C" = "C",
  "Bash" = "Bash",
  "Python" = "Python",
}

export const defaultCodeModeStringOptions = {
  language: CodeLanguage.JS,
  lines: 6,
}

export interface State {
  machineState: MachineState
  currentUserPressedKeys: Set<string>
  trainingStringGenerator: TrainingStringGenerator
  trainingString: string
  cursor: number
  mistakeCharIndices: Set<number>
  courseLevelIndex: number
  wordsPerMinute: number
  successRate: number
  totalSessions: number
  wordsPerMinuteAverage: number
  successRateAverage: number
  uiModeSelectShow: boolean
  uiSettingsModalShow: boolean
  uiTheme: { [index: string]: CSSCustomProperties }

  language: Language
  keyboard: Keyboard
  trainingMode: TrainingMode
  trainingStringFontSize: number

  guidedCourse: Course
  guidedWordLength: number
  guidedNumWords: number
  guidedHasCaps: boolean
  guidedHasPunctuation: boolean
  guidedHasNumbers: boolean
  guidedHasSymbols: boolean
  guidedLikelihoodModified: number

  practiceSourceText: string

  codeLanguage: CodeLanguage
  codeLines: number
}

export const defaultState: State = {
  machineState: "INIT",
  trainingStringGenerator: defaultGenerator,
  currentUserPressedKeys: new Set(),
  trainingString: "",
  cursor: 0,
  mistakeCharIndices: new Set(),
  courseLevelIndex: 32,
  wordsPerMinute: 0,
  successRate: 0,
  totalSessions: 0,
  wordsPerMinuteAverage: 0,
  successRateAverage: 0,

  uiModeSelectShow: false,
  uiSettingsModalShow: false,

  language: defaultLanguage,
  keyboard: defaultLayout,
  trainingMode: TrainingMode.PRACTICE,

  uiTheme: themes.dark,
  trainingStringFontSize: 1,

  guidedCourse: Courses.guidedCourse,
  guidedWordLength: 6,
  guidedNumWords: 8,
  guidedHasCaps: false,
  guidedHasPunctuation: false,
  guidedHasNumbers: false,
  guidedHasSymbols: false,
  guidedLikelihoodModified: 0.8,

  practiceSourceText: defaultText.text,

  codeLanguage: CodeLanguage.JS,
  codeLines: 6,
}

export const inactivityDelay = 2000 //todo: mettre dans settings

export default defaultState
