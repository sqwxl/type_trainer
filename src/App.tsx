import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Keyboard from './Components/Keyboard/Keyboard';
import { TextDisplay, TextDisplayProps } from './Components/TextDisplay/TextDisplay';
import { ThemeContext, themes } from './Components/Contexts/ThemeContext/ThemeContext';
import { LayoutContext, layouts } from './Components/Contexts/LayoutContext/LayoutContext';
import Toolbar from './Components/Toolbar/Toolbar'
import { Container } from 'react-bootstrap';
// import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';


interface AppProps { }
interface AppState {
  displayText: string;
  pressed: string[];
}
const INITIALSTATE: AppState = {
  displayText: "",
  pressed: []
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

function replaceSpaces(str: string): string {
  // let replacement = `&blank;<span style="font-family: sans-serif;">&NegativeVeryThinSpace;</span>`
  let replacement = `&blank;&NegativeVeryThinSpace;`
  return str.replaceAll(" ", replacement)//"␣")
}

class App extends React.Component<{}, any> {
  static contextType = ThemeContext
  constructor(props: AppProps) {
    super(props)
    this.state = {
      trainingString: "The add() method appends a new element with a specified value to the end of a Set object.",
      currentChar: 0,
      errorIndices: new Set(),
      pressed: [],
      paused: false,
      theme: themes.light
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    // this.keyReleaseTimer = setTimeout(() => { }, 0)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentDidUpdate() {
    console.log(this.state.errorIndices)
  }

  componentWillMount() {
    // const str = replaceSpaces(this.state.trainingString)
    // this.setState({ trainingString: str })
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('blur', this.handleBlur)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('blur', this.handleBlur)
  }

  checkCorrect(key: string): boolean {
    let str = this.state.trainingString
    let i = this.state.currentChar
    if (key === str[i]) {
      return true
    } else {
      return false
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    // event.preventDefault()
    let { pressed, currentChar, errorIndices } = this.state

    // Reject input
    if (this.state.paused || event.repeat || pressed.includes(event.code)) {
      return
    }
    pressed.push(event.code)

    // Validate
    if (isChar(event.code)) {
      if (this.checkCorrect(event.key)) {
        currentChar += 1
      } else {
        errorIndices.add(this.state.currentChar)
      }
    }
    // Update state
    this.setState({ pressed: pressed, currentChar: currentChar, errorIndices: errorIndices })
  }

  handleKeyUp(event: KeyboardEvent) {
    event.preventDefault()
    let pressed = this.state.pressed.filter((code: string) => code !== event.code)
    this.setState({ pressed: pressed })
  }

  handleFocus() {
    console.log("got focus")
    this.setState({paused: false})
  }

  handleBlur() {
    this.setState({ pressed: [], paused: true })
  }

  toggleTheme() {
    this.setState({ theme: this.state.theme === themes.light ? themes.dark : themes.light })
  }

  getStrMarkup() {
    let { currentChar, trainingString, errorIndices } = this.state
    // trainingString = replaceSpaces(trainingString)
    let tagged = ""
    let start = 0
    // Tag errors, up to but not including currentChar
    for (let e of errorIndices) {
      if (e === currentChar) break
      if (e < start) continue
      tagged = tagged.concat(replaceSpaces(trainingString.slice(start, e)), tag(trainingString[e], `<span class="errorChar">`, `</span>`))
      start = e + 1
    }
    // Tag currentChar
    tagged = tagged.concat(replaceSpaces(trainingString.slice(start, currentChar)), tag(trainingString[currentChar], `<span class="currentChar">`, `</span>`), replaceSpaces(trainingString.slice(currentChar + 1)))
    return tagged
    
    function tag(content: string, open: string, close: string) {
      return open + replaceSpaces(content) + close
    }
  }

  render() {
    let displayText = this.state.paused ? "Session paused, click anywhere to continue" : this.getStrMarkup()
    return (
      <ThemeContext.Provider value={{ theme: this.state.theme, toggleTheme: () => this.toggleTheme() }}>
        <Container fluid className="App" style={this.state.theme}  onClick={this.handleFocus}>
          <Container >
          <Toolbar />
          <TextDisplay displayText={displayText}></TextDisplay>
          <Keyboard pressed={this.state.pressed} />
        </Container>
        </Container>
        
      </ThemeContext.Provider>
    );
  }

}

export default App;
