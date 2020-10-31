import { themes } from "./Contexts/ThemeContext/ThemeContext"
import { CSSCustomProperties } from "./Contexts/ThemeContext/css"
import Courses, { Course } from "../assets/Courses/Courses"
import {
  PracticeModeStringGenerator,
  TrainingStringGenerator,
} from "../core/TrainingStringGenerator/TrainingStringGenerator"
import { Language } from "../core/Language"
import enUsQwerty from "../assets/Layouts/en_US"
import text from "../assets/Texts/state_and_revolution"
import sanitizeStringForChars from "../utils/sanitizeStringForChars"
import { KeyboardLayout } from "../core/KeyboardLayout"
import { CharacterType } from "../core/CharacterSet"

const stateRev = text // TODO: Make generic lol

export enum MachineState {
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
export const FontSizes: { [key: number]: string } = {
  0: "1rem",
  1: "1.5rem",
  2: "2rem",
}

export enum FormType {
  Parent,
  Switch,
  Number,
  Text,
  Select,
}

export class UserStringOption {
  value: boolean | number | string | UserStringOptions
  formLabel: string
  formType: FormType
  min: number
  max: number
  step: number
  values: string[]
  constructor(
    init: {value: boolean | number | string | UserStringOptions,
    formLabel: string,
    formType: FormType,
    min?: number,
    max?: number,
    step?: number,
    values?: string[]}
  ) {
    const { value, formLabel, formType, min, max, step, values } = init
    this.value = value
    this.formLabel = formLabel
    this.formType = formType
    this.min = min == null ? 0 : min
    this.max = max == null ? 100 : max
    this.step = step == null ? 1 : step
    this.values = values == null ? [] : values
  }
  setNestedOption(name: string, value: boolean | number | string | UserStringOptions): boolean {
    if (isUserStringOptions(this.value)) {
      if (name in this.value) {
        this.value[name].value = value
        return true
      } else {
        Object.values(this.value).forEach(userStringOption => userStringOption.setNestedOption(name, value))
      }
    }
    return false
    function isUserStringOptions(value: boolean | number | string | UserStringOptions): value is UserStringOptions {
      return value as UserStringOptions !== undefined && Object.values(value as UserStringOptions).some(val => val.value !== undefined || isUserStringOptions(val.value))
    }
  }
}

export interface UserStringOptions {
  [key: string]: UserStringOption
}

export const defaultGuidedModeStringOptions: UserStringOptions = {
  wordLength: new UserStringOption({value:
    {
      minLength: new UserStringOption({value: 3, formLabel: "Minimum", formType: FormType.Number, min: 3, max: 6, step: 1}),
      maxLength: new UserStringOption({value: 12, formLabel: "Maximum", formType: FormType.Number, min: 7, max: 15, step: 1}),
    },
    formLabel:"Word length",
    formType: FormType.Parent}
  ),
  wordModifierOptions: new UserStringOption({value:
    {
      caps: new UserStringOption({ value: false, formLabel: "Aa", formType: FormType.Switch }),
      punct: new UserStringOption({ value: false, formLabel:  "Punctuation", formType: FormType.Switch}),
      syms: new UserStringOption({  value: false, formLabel: "Symbols", formType:  FormType.Switch }),
      nums: new UserStringOption({ value: false, formLabel: "0-9", formType: FormType.Switch}),
    },
    formLabel: "Options",
    formType: FormType.Parent},
  ),
  modifyingLikelihood: new UserStringOption({ value: 0.8, formLabel: "% modified", formType: FormType.Number, min: 0, max: 1, step: 0.1 }),
  wordsPerString: new UserStringOption({ value: 6, formLabel: "Words per session", formType: FormType.Number, min: 1, max: 100, step: 1 }),
}
export const defaultLayout = new KeyboardLayout(enUsQwerty.keyCapLabelMap)
export const defaultLanguage = new Language(enUsQwerty.characterSet, enUsQwerty.vowels)
export const formattedSource = sanitizeStringForChars(stateRev, defaultLanguage.characterSet.uniqueGlyphs()) // TODO MAKE GENERIC

export const defaultPracticeModeStringOptions: UserStringOptions = {
  sourceText: new UserStringOption({ value: formattedSource, formLabel: "Source text", formType: FormType.Text}),
  fullSentences: new UserStringOption({ value: true, formLabel: "Full sentences", formType:  FormType.Switch }),
  wordsPerString: new UserStringOption({ value: 6, formLabel: "Words per session", formType: FormType.Number, min: 1, max: 100, step: 1 }),
}

export enum CodingLanguage {
  "JS" = "JavaScript",
  "TS" = "TypeScript",
  "C" = "C",
  "Bash" = "Bash",
  "Python" = "Python",
}

export const defaultCodeModeStringOptions: UserStringOptions = {
  language: new UserStringOption({
    value: CodingLanguage.JS,
    formLabel: "Language",
    formType: FormType.Select,
    values: Object.values(CodingLanguage) as string[]}
  ),
  lines: new UserStringOption({ value: 6, formLabel: "Lines", formType: FormType.Number, min: 1, max: 20, step: 1 }),
}

interface Settings {
  layout: Layout
  UI: {
    theme: { [index: string]: CSSCustomProperties }
    fontSize: number
  }
  course: Course
  stringOptions: UserStringOptions
}
const defaultSettings: Settings = {
  UI: { theme: themes.dark, fontSize: 1 },
  layout: defaultLayout,
  course: Courses.guidedCourse,
  stringOptions: defaultPracticeModeStringOptions,
}

export interface State {
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
      mistakeCount: number
    }
  }
  settings: Settings
}
export const defaultGenerator = new PracticeModeStringGenerator()

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

export const inactivityDelay = 2000 //todo: mettre dans settings

export default defaultState
