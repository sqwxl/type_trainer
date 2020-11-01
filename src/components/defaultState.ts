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
import { StringGeneratorOption, StringGeneratorOptions } from "../core/TrainingStringGenerator/StringGeneratorOption"
import TrainingText from "../core/TrainingText"
import { Language } from "../core/Language"
import Keyboard from "../core/Keyboard"


const defaultLayout = en_qwerty
const defaultLanguage = English
const defaultText = new TrainingText(state_and_revolution, English)
const defaultGenerator = new PracticeModeStringGenerator()

export const FontSizes = ["1rem","1.5rem","2rem"]
export type MachineState = "LOADED" | "READY" | "PAUSED" | "TRAINING"

export enum TrainingMode {
  Guided = "Guided Mode",
  Practice = "Practice Mode",
  Code = "Code Mode",
}
export const defaultGuidedModeStringGeneratorOptions: StringGeneratorOptions = {
  wordLength: new StringGeneratorOption({
    value: {
      minLength: new StringGeneratorOption({
        value: 3,
        formLabel: "Minimum",
        formType: 'NUMBER',
        min: 3,
        max: 6,
        step: 1,
      }),
      maxLength: new StringGeneratorOption({
        value: 12,
        formLabel: "Maximum",
        formType: 'NUMBER',
        min: 7,
        max: 15,
        step: 1,
      }),
    },
    formLabel: "Word length",
    formType: 'PARENT',
  }),
  wordModifierOptions: new StringGeneratorOption({
    value: {
      caps: new StringGeneratorOption({ value: false, formLabel: "Aa", formType: 'SWITCH' }),
      punct: new StringGeneratorOption({ value: false, formLabel: "Punctuation", formType: 'SWITCH' }),
      syms: new StringGeneratorOption({ value: false, formLabel: "Symbols", formType: 'SWITCH' }),
      nums: new StringGeneratorOption({ value: false, formLabel: "0-9", formType: 'SWITCH' }),
    },
    formLabel: "Options",
    formType: 'PARENT',
  }),
  modifyingLikelihood: new StringGeneratorOption({
    value: 0.8,
    formLabel: "% modified",
    formType: 'NUMBER',
    min: 0,
    max: 1,
    step: 0.1,
  }),
  wordsPerString: new StringGeneratorOption({
    value: 6,
    formLabel: "Words per session",
    formType: 'NUMBER',
    min: 1,
    max: 100,
    step: 1,
  }),
}

export const defaultPracticeModeStringOptions: StringGeneratorOptions = {
  sourceText: new StringGeneratorOption({ value: defaultText.text, formLabel: "Source text", formType: 'TEXT' }),
  fullSentences: new StringGeneratorOption({ value: true, formLabel: "Full sentences", formType: 'SWITCH' }),
  wordsPerString: new StringGeneratorOption({
    value: 6,
    formLabel: "Words per session",
    formType: 'NUMBER',
    min: 1,
    max: 100,
    step: 1,
  }),
}

export enum CodingLanguage {
  "JS" = "JavaScript",
  "TS" = "TypeScript",
  "C" = "C",
  "Bash" = "Bash",
  "Python" = "Python",
}

export const defaultCodeModeStringOptions: StringGeneratorOptions = {
  language: new StringGeneratorOption({
    value: CodingLanguage.JS,
    formLabel: "Language",
    formType: 'SELECT',
    values: Object.values(CodingLanguage) as string[],
  }),
  lines: new StringGeneratorOption({ value: 6, formLabel: "Lines", formType: 'NUMBER', min: 1, max: 20, step: 1 }),
}

interface Settings {
  language: Language
  keyboard: Keyboard
  UI: {
    theme: { [index: string]: CSSCustomProperties }
    fontSize: number
  }
  course: Course
  stringOptions: StringGeneratorOptions
}

const defaultSettings: Settings = {
  language: defaultLanguage,
  keyboard: defaultLayout,
  UI: { theme: themes.dark, fontSize: 1 },
  course: Courses.guidedCourse,
  stringOptions: defaultPracticeModeStringOptions,
}

export interface State {
  modeSelectShow: boolean
  settingsModalShow: boolean
  trainingMode: TrainingMode          // TODO: move to settings
  generator: TrainingStringGenerator
  pressed: Set<string>
  machineState: MachineState
  trainingString: string
  cursor: number
  mistakeCharIndices: Set<number>
  courseLevelIndex: number
  stats: {
    wpm: number
    mistakeRatio: number
    totalSessions: number
    averages: {
      wpm: number
      mistakeRatio: number
    }
  }
  settings: Settings
}

export const defaultState: State = {
  modeSelectShow: false,
  settingsModalShow: false,
  trainingMode: TrainingMode.Practice,
  generator: defaultGenerator,
  trainingString: "",
  cursor: 0,
  mistakeCharIndices: new Set(),
  courseLevelIndex: 33,
  stats: {
    wpm: 0,
    mistakeRatio: 0,
    totalSessions: 0,
    averages: { wpm: 0, mistakeRatio: 0 },
  },
  pressed: new Set(),
  machineState: 'LOADED',
  settings: { ...defaultSettings },
}

export const inactivityDelay = 2000 //todo: mettre dans settings

export default defaultState
