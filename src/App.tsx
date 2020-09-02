import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Keyboard from './Components/Keyboard/Keyboard';
import { TextDisplay } from './Components/TextDisplay/TextDisplay';
import { ThemeContext, themes } from './Components/Contexts/ThemeContext/ThemeContext';
import Toolbar from './Components/Toolbar/Toolbar'
import { Container } from 'react-bootstrap';
import FormattedText from './Components/FormattedText/FormattedText';
import ThemeToggleSwitch from './Components/ThemeToggleSwitch/ThemeToggleSwitch'

import Foswig from 'foswig'

import dict from './english_words_array.json'
import FontSizeSelect from './Components/FontSizeSelect/FontSizeSelet';

// let dict
// let loadDict = async function() { await fetch("./english_words_array.json").then(res => res.json()).then(data => {console.log(data);dict = data}).catch(err => console.log(err)) }
// loadDict()
// console.log(dict)
const chain = new Foswig(3, dict.dict)
const options = { minLength: 3, maxLength: 12 }

function generateStr() {
  let words: Array<string> = []
  while (words.length < 10) {
    words.push(chain.generate(options))
  }
  return words.join(" ")
}

function isChar(code: string) {
  if (code.slice(0, 3) === 'Key') return true
  if (code.slice(0, 5) === 'Digit') return true
  switch (code) {
    case 'Space':
    case 'Backquote':
    case 'Minus':
    case 'Equal':
    case 'BracketLeft':
    case 'BracketRight':
    case 'Backslash':
    case 'Semicolon':
    case 'Quote':
    case 'Comma':
    case 'Period':
    case 'Slash':
      return true
    default:
      return false
  }
}

enum AppStatus {
  NewSession,
  Paused,
  Training
}

const FontSizes: {[key: number]: string} = {0:"1rem", 1:"1.5rem", 2:"2rem"}

class App extends React.Component<{}, any> {
  static contextType = ThemeContext
  constructor(props: any) {
    super(props)
    this.state = {
      trainingStr: generateStr(),//"Xylem Tube EP is an EP by the English electronic music producer Richard D. James under the pseudonym of Aphex Twin, released in June 1992 by Apollo Records. It was his second release under the Aphex Twin alias. Xylem Tube EP was released exclusively on vinyl in June 1992.",
      cursor: 0,
      mistakes: new Set(),
      pressed: new Set(),
      status: AppStatus.NewSession,
      settings: {
        theme: themes.dark,
        fontSize: 1,
      }
    }
    // this.handleKeyDown = this.handleKeyDown.bind(this)
    // this.handleKeyUp = this.handleKeyUp.bind(this)
    // this.handleBlur = this.handleBlur.bind(this)
    // this.toggleTheme = this.toggleTheme.bind(this)
    // this.handleFocus = this.handleFocus.bind(this)
  }

  componentDidUpdate() {
    console.log("settings: ", this.state.settings)
  }

  componentWillMount() {

  }

  componentDidMount() {
    document.addEventListener('keydown', e => this.handleKeyDown(e))
    document.addEventListener('keyup', e => this.handleKeyUp(e))
    document.addEventListener('blur', () => this.handleBlur())
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', e => this.handleKeyDown(e))
    document.removeEventListener('keyup', e => this.handleKeyUp(e))
    document.removeEventListener('blur', () => this.handleBlur())
  }

  handleKeyDown(event: KeyboardEvent) {
    let { pressed, trainingStr, cursor, mistakes } = this.state

    // Reject input
    if (this.state.status === AppStatus.Paused || event.repeat || pressed.has(event.code)) {
      return
    }
    pressed.add(event.code)

    // Validate
    if (isChar(event.code)) {
      if (trainingStr[cursor] === event.key) {
        cursor += 1
        if (cursor === trainingStr.length) {
          cursor = 0
          trainingStr = generateStr()
          mistakes = new Set()
        }
      } else {
        mistakes.add(this.state.cursor)
      }
    }
    // Update state
    this.setState({ pressed: pressed, trainingStr: trainingStr, cursor: cursor, mistakes: mistakes })

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
    this.setState({ theme: this.state.settings.theme === themes.light ? themes.dark : themes.light })
  }

  toggleFontSize() {
    let {settings} = this.state
    settings.fontSize = (settings.fontSize + 1) % 3
    this.setState({ settings: settings })
  }

  render() {
    console.log(FontSizes[this.state.settings.fontSize])
    return (
      <ThemeContext.Provider value={{ theme: this.state.settings.theme, toggleTheme: () => this.toggleTheme() }}>
        <Container fluid className="App" style={this.state.settings.theme} onClick={() => this.handleFocus()}>
          <Container >
            <Toolbar>
              <FontSizeSelect toggleFn={() => this.toggleFontSize()} />
              <ThemeToggleSwitch />
            </Toolbar>
            <TextDisplay style={{ fontSize: FontSizes[this.state.settings.fontSize] }}>
              {this.state.status === AppStatus.Paused ?
                (<p>Session paused, click anywhere to continue</p>) :
                this.state.status === AppStatus.NewSession ?
                  (<p>Click here to begin</p>) :
                  <FormattedText cursor={this.state.cursor} trainingStr={this.state.trainingStr} mistakes={this.state.mistakes} />}
            </TextDisplay>
            <Keyboard pressed={this.state.pressed} />
          </Container>
        </Container>

      </ThemeContext.Provider>
    );
  }

}

export default App;
