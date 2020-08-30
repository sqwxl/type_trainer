import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Keyboard from './Components/Keyboard/Keyboard';
import { TextDisplay, TextDisplayProps } from './Components/TextDisplay/TextDisplay';
import { ThemeContext, themes } from './Components/Contexts/ThemeContext/ThemeContext';
import { LayoutContext, layouts } from './Components/Contexts/LayoutContext/LayoutContext';
import Toolbar from './Components/Toolbar/Toolbar'
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

class App extends React.Component<{}, any> {
  static contextType = ThemeContext
  constructor(props: AppProps) {
    super(props)
    this.state = {
      displayText: "",
      pressed: [],
      theme: themes.light
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    // this.keyReleaseTimer = setTimeout(() => { }, 0)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)
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

  handleKeyDown(event: KeyboardEvent) {
    event.preventDefault()
    let pressed = this.state.pressed
    if (event.repeat || pressed.includes(event.code)) {
      // clearTimeout(this.keyReleaseTimer)
      return
    }
    pressed.push(event.code)
    this.setState({ pressed: pressed })
  }

  handleKeyUp(event: KeyboardEvent) {
    event.preventDefault()
    let pressed = this.state.pressed.filter((code: string) => code !== event.code)
    this.setState({ pressed: pressed })
  }

  // scheduleKeyRelease = (c: string) => setTimeout(() => {
  //   let pressed = this.state.pressed.filter(code => code !== c)
  //   this.setState({ pressed: pressed})
  // }, 50)

  handleBlur() {
    this.setState({ pressed: [] })
  }

  toggleTheme() {
    this.setState({theme: this.state.theme === themes.light ? themes.dark : themes.light })
  }

  render() {
    return (
      <ThemeContext.Provider value={{theme: this.state.theme, toggleTheme: () => this.toggleTheme()}}>
          <div className="App" style={this.state.theme}>
            <Toolbar />
            <TextDisplay displayText={this.state.displayText}></TextDisplay>
            <Keyboard pressed={this.state.pressed} />
          </div>
      </ThemeContext.Provider>
    );
  }

}

export default App;
