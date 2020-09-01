import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Keyboard from './Components/Keyboard/Keyboard';
import { TextDisplay, TextDisplayProps } from './Components/TextDisplay/TextDisplay';
import { ThemeContext, themes } from './Components/Contexts/ThemeContext/ThemeContext';
import { LayoutContext, layouts } from './Components/Contexts/LayoutContext/LayoutContext';
import Toolbar from './Components/Toolbar/Toolbar'
import { Container } from 'react-bootstrap';
import { type } from 'os';
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

class App extends React.Component<{}, any> {
  static contextType = ThemeContext
  constructor(props: AppProps) {
    super(props)
    this.state = {
      trainingString: "Xylem Tube EP is an EP by the English electronic music producer Richard D. James under the pseudonym of Aphex Twin, released in June 1992 by Apollo Records. It was his second release under the Aphex Twin alias. Xylem Tube EP was released exclusively on vinyl in June 1992.",
      currentChar: 0,
      errorIndices: new Set(),
      pressed: new Set(),
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
    console.log("errors: ", this.state.errorIndices)
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
    if (this.state.paused || event.repeat || pressed.has(event.code)) {
      return
    }
    pressed.add(event.code)

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
    let pressed = this.state.pressed
    pressed.delete(event.code)
    this.setState({ pressed: pressed })
  }

  handleFocus() {
    this.setState({ paused: false })
  }

  handleBlur() {
    this.setState({ pressed: new Set(), paused: true })
  }

  toggleTheme() {
    this.setState({ theme: this.state.theme === themes.light ? themes.dark : themes.light })
  }

  getStrMarkup() {
    let { currentChar, trainingString, errorIndices } = this.state
    // trainingString = replaceSpaces(trainingString)
    let before = ""
    let current = ""
    let after = format(trainingString.slice(currentChar + 1))
    
    // Tag errors, up to but not including currentChar
    let start = 0
    for (let e of errorIndices) {
      if (e === currentChar) break
      before = before.concat(format(trainingString.slice(start, e)), tag(format(trainingString[e]), 'mistake'))
      start = e + 1
    }
    before = tag(before.concat(format(trainingString.slice(start, currentChar))), 'before')

    // Tag currentChar
    if (errorIndices.has(currentChar)) {
      current = tag(format(trainingString[currentChar]), 'typo')
      setTimeout(() => {
        let typo = document.getElementsByClassName('typo')
        if (typo[0] != null) typo[0].className = 'currentChar'
      }, 750)
    } else {
      current = tag(format(trainingString[currentChar]), 'currentChar')
    }

    // Return result
    console.log(current)
    return before.concat(current, after)

    function tag(str: string, className: string): string {
      let ret = `<span class="${className}">${str}</span>`
      return ret
    }
    function format(str: string): string {
      if (str)
        return replaceSpaces(escapeHtml(str))
      else
        return ""
    }
    function escapeHtml(unsafe: string): string {
      var text = document.createTextNode(unsafe);
      var p = document.createElement('p');
      p.appendChild(text);
      let safe = p.innerHTML
      p.remove()
      return safe
    }
    function replaceSpaces(str: string): string {
      let replacement = `&blank;&#8203;`
      return str.replaceAll(" ", replacement)//"␣")
    }
  }

  render() {
    let displayText = this.state.paused ? "Session paused, click anywhere to continue" : this.getStrMarkup()
    return (
      <ThemeContext.Provider value={{ theme: this.state.theme, toggleTheme: () => this.toggleTheme() }}>
        <Container fluid className="App" style={this.state.theme} onClick={this.handleFocus}>
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
