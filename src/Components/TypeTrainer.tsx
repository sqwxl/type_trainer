import React from "react"
import Keyboard from "./Keyboard/Keyboard"
import { TextDisplay } from "./TextDisplay/TextDisplay"
import { ThemeContext, themes } from "./Contexts/ThemeContext/ThemeContext"
import Toolbar from "./Toolbar/Toolbar"
import { Container } from "react-bootstrap"
import FormattedText from "./FormattedText/FormattedText"
import ThemeToggleSwitch from "./Toolbar/ThemeToggleSwitch/ThemeToggleSwitch"
import Foswig from "foswig"
import dict from "../english_words_array.json"
import FontSizeSelect from "./Toolbar/FontSizeSelect/FontSizeSelet"
import CharacterCheckboxForm from "./Toolbar/CharacterCheckboxForm/CharacterCheckboxForm"
import { isChar, isVowel } from "../utils"
import { FontSizes } from "../App"

const chain = new Foswig(3, dict.dict)
const options = { minLength: 3, maxLength: 12 }
enum AppStatus {
  NewSession,
  Paused,
  Training,
}
const defaultSettings = {
  theme: themes.dark,
  fontSize: 1,
  characters: {
    letters: true,
    caps: false,
    punct: false,
    syms: false,
    nums: false,
    spaces: true,
  },
}

export class TypeTrainer extends React.Component<{}, any> {
  static contextType = ThemeContext
  constructor(props: any) {
    super(props)
    this.state = {
      trainingString: "",
      cursor: 0,
      mistakes: new Set(),
      pressed: new Set(),
      status: AppStatus.NewSession,
      settings: { ...defaultSettings },
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", e => this.handleKeyDown(e))
    document.addEventListener("keyup", e => this.handleKeyUp(e))
    document.addEventListener("blur", () => this.handleBlur())
    this.setState({ trainingString: this.generateTrainingString() })
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", e => this.handleKeyDown(e))
    document.removeEventListener("keyup", e => this.handleKeyUp(e))
    document.removeEventListener("blur", () => this.handleBlur())
  }

  handleKeyDown(event: KeyboardEvent) {
    event.preventDefault()
    let { pressed, trainingString, cursor, mistakes } = this.state

    // Reject input
    if (this.state.status === AppStatus.Paused || event.repeat || pressed.has(event.code)) {
      return
    }
    pressed.add(event.code)

    // Validate
    if (isChar(event.code)) {
      if (trainingString[cursor] === event.key) {
        cursor += 1
        if (cursor === trainingString.length) {
          cursor = 0
          trainingString = this.generateTrainingString()
          mistakes = new Set()
        }
      } else {
        mistakes.add(this.state.cursor)
      }
    }
    // Update state
    this.setState({ pressed: pressed, trainingString: trainingString, cursor: cursor, mistakes: mistakes })
  }

  handleKeyUp(event: KeyboardEvent) {
    event.preventDefault()
    let pressed = this.state.pressed
    pressed.delete(event.code)
    this.setState({ pressed: pressed })
  }

  handleFocus() {
    this.setState({ status: AppStatus.Training })
  }

  handleBlur() {
    this.setState({ pressed: new Set(), status: AppStatus.Paused })
  }

  toggleTheme() {
    let settings = { ...this.state.settings }
    settings.theme = settings.theme === themes.light ? themes.dark : themes.light
    this.setState({ settings: settings })
  }

  toggleFontSize() {
    let settings = { ...this.state.settings }
    settings.fontSize = (settings.fontSize + 1) % 3
    this.setState({ settings: settings })
  }

  setQuickSettings(obj: any) {
    if (!obj.letters) {
      obj.caps = false
    }
    let settings = {...this.state.settings}
    settings.characters = {...obj}
    this.setState({ settings: settings }, () => this.setState({ trainingString: this.generateTrainingString() }))
  }

  generateTrainingString() {
    if (Object.values(this.state.settings.characters).every(v => !v)) return ""
    let { letters, caps, punct, syms, nums, spaces } = this.state.settings.characters
    let words: Array<string> = []

    enum Kind {
      "punctual",
      "splitting",
      "surrounding",
    }
    interface CharacterSet {
      kind: Kind
      chars: Array<string | string[]>
      weight: number
    }

    const punctuation: Array<CharacterSet> = [
      {
        kind: Kind.punctual,
        chars: [",", ".", "?", "!", ";", ":", "'s"],
        weight: 5,
      },
      {
        kind: Kind.surrounding,
        chars: [["'"], ['"'], ["(", ")"]],
        weight: 5,
      },
      {
        kind: Kind.splitting,
        chars: ["'", "-"],
        weight: 5,
      },
    ]

    const symbols: Array<CharacterSet> = [
      {
        kind: Kind.punctual,
        chars: ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "=", "+", "\\", "|", "<", ">", "/"],
        weight: 8,
      },
      {
        kind: Kind.surrounding,
        chars: [["'"], ['"'], ["(", ")"], ["[", "]"], ["{ ", " }"], ["<", ">"]],
        weight: 6,
      },
      {
        kind: Kind.splitting,
        chars: [".", "@", "_", "\\", "/"],
        weight: 5,
      },
    ]

    const numbers: Array<CharacterSet> = [
      {
        kind: Kind.punctual,
        chars: ["0", "1", "3", "4", "5", "6", "7", "9"],
        weight: 5,
      },
    ]

    const modifyingLikelyhood = 0.8
    let willApply = () => Math.random() * modifyingLikelyhood

    while (words.length < 10) {
      let word = letters ? chain.generate(options) : ""
      if (caps && willApply()) word = word.slice(0, 1).toUpperCase().concat(word.slice(1))
      if (punct && willApply()) word = symbolize(word, punctuation)
      if (syms && willApply()) word = symbolize(word, symbols)
      if (nums && willApply()) word = symbolize(word, numbers)
      words.push(word)
    }
    
    return words.join(spaces ? " " : "")

    function symbolize(str: string, symbols: Array<CharacterSet>): string {
      // Relative likelihoods of different types of punctuation
      const weights = symbols.reduce((a, c) => a.concat([c.weight]), [] as number[])
      let loto = Math.round(Math.random() * weights.reduce((a, c) => c + a))
      let type = 0
      let sum = 0
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i]
        if (loto <= sum) {
          type = i
          break
        }
      }
      let symbolized = str
      let { kind, chars } = symbols[type]
      let s = chars[Math.floor(Math.random() * chars.length)]
      switch (kind) {
        case Kind.punctual: // punctuating
          if (s instanceof Array) s = s[0]
          symbolized = str.concat(s)
          break
        case Kind.surrounding: // surounding
          symbolized = s[0].concat(str, s[1] || s[0])
          break
        case Kind.splitting: // splitting
          if (str.length < 5) break
          let split = 0
          // Try to split somewhere after 2nd and before 2nd-to-last letters -- not between two vowels
          for (let i = 2; i < str.length - 3; i++) {
            if (!isVowel(str[i]) && !isVowel(str[i + 1])) {
              split = i
              break
            }
          }
          if (split === 0) break
          if (s instanceof Array) s = s[0]
          symbolized = str.slice(0, split).concat(s, str.slice(split))
          break
        default:
          break
      }
      return symbolized
    }
  }

  render() {
    return (
      <ThemeContext.Provider value={{ theme: this.state.settings.theme, toggleTheme: () => this.toggleTheme() }}>
        <Container fluid className="App" style={this.state.settings.theme} onClick={() => this.handleFocus()}>
          <Container>
            <Toolbar>
              <CharacterCheckboxForm
                characters={this.state.settings.characters}
                updateSettings={(settings: any) => this.setQuickSettings(settings)}
              />
              <FontSizeSelect toggleFn={() => this.toggleFontSize()} />
              <ThemeToggleSwitch />
            </Toolbar>
            <TextDisplay style={{ fontSize: FontSizes[this.state.settings.fontSize] }}>
              {this.state.status === AppStatus.NewSession ? (
                <p>Click here to begin</p>
              ) : this.state.status === AppStatus.Paused ? (
                <p>Session paused, click anywhere to continue</p>
              ) : (
                <FormattedText
                  cursor={this.state.cursor}
                  trainingString={this.state.trainingString}
                  mistakes={this.state.mistakes}
                />
              )}
            </TextDisplay>
            <Keyboard pressed={this.state.pressed} />
          </Container>
        </Container>
      </ThemeContext.Provider>
    )
  }
}
