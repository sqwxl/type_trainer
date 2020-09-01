import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Keyboard from './Components/Keyboard/Keyboard';
import { TextDisplay } from './Components/TextDisplay/TextDisplay';
import { ThemeContext, themes } from './Components/Contexts/ThemeContext/ThemeContext';
import Toolbar from './Components/Toolbar/Toolbar'
import { Container } from 'react-bootstrap';
import FormattedText from './Components/FormattedText/FormattedText';


interface AppProps { }
interface AppState {
  displayText: string;
  pressed: string[];
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

class App extends React.Component<{}, any> {
  static contextType = ThemeContext
  constructor(props: AppProps) {
    super(props)
    this.state = {
      trainingString: "Xylem Tube EP is an EP by the English electronic music producer Richard D. James under the pseudonym of Aphex Twin, released in June 1992 by Apollo Records. It was his second release under the Aphex Twin alias. Xylem Tube EP was released exclusively on vinyl in June 1992.",
      currentChar: 0,
      errorIndices: new Set(),
      pressed: new Set(),
      status: AppStatus.NewSession,
      theme: themes.dark,
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentDidUpdate() {
    console.log("errors: ", this.state.errorIndices)
  }

  componentWillMount() {
    
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
    let { pressed, currentChar, errorIndices } = this.state

    // Reject input
    if (this.state.status === AppStatus.Paused || event.repeat || pressed.has(event.code)) {
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
    this.setState({ status: AppStatus.Training })
  }

  handleBlur() {
    this.setState({ pressed: new Set(), status: AppStatus.Paused })
  }

  toggleTheme() {
    this.setState({ theme: this.state.theme === themes.light ? themes.dark : themes.light })
  }

  render() {
    return (
      <ThemeContext.Provider value={{ theme: this.state.theme, toggleTheme: () => this.toggleTheme() }}>
        <Container fluid className="App" style={this.state.theme} onClick={this.handleFocus}>
          <Container >
            <Toolbar />
            <TextDisplay>
              {this.state.status === AppStatus.Paused ?
              (<p>Session paused, click anywhere to continue</p>) :
              this.state.status === AppStatus.NewSession ?
              (<p>Click here to begin</p>) :
                <FormattedText currentChar={this.state.currentChar} trainingString={this.state.trainingString} errorIndices={this.state.errorIndices} />}
            </TextDisplay>
            <Keyboard pressed={this.state.pressed} />
          </Container>
        </Container>

      </ThemeContext.Provider>
    );
  }

}

export default App;
