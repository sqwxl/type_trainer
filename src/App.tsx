import React from 'react';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Keyboard from './Components/Keyboard/Keyboard';
import { TrainerDisplayArea, TrainerDisplayAreaProps } from './Components/TrainerDisplayArea/TrainerDisplayArea';
import { ThemeContext, themes } from './Components/Contexts/ThemeContext/ThemeContext';
import { LayoutContext, layouts } from './Components/Contexts/LayoutContext/LayoutContext';


interface AppProps { }
interface AppState {
  displayText: string;
  pressed: string[];
}
const INITIALSTATE: AppState = {
  displayText: "",
  pressed: []
}

class App extends React.Component<{}, AppState> {
  // keyReleaseTimer: NodeJS.Timeout;
  constructor(props: AppProps) {
    super(props)
    this.state = INITIALSTATE
    this.handleKeyDown = this.handleKeyDown.bind(this)
    // this.keyReleaseTimer = setTimeout(() => { }, 0)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
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
    let pressed = this.state.pressed.filter(code => code !== event.code)
    this.setState({ pressed: pressed })
  }

  // scheduleKeyRelease = (c: string) => setTimeout(() => {
  //   let pressed = this.state.pressed.filter(code => code !== c)
  //   this.setState({ pressed: pressed})
  // }, 50)

  handleBlur() {
    this.setState({ pressed: [] })
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <div className="App" style={theme}>
            <TrainerDisplayArea displayText={this.state.displayText}></TrainerDisplayArea>
            <Keyboard pressed={this.state.pressed} />
          </div>
        )}
      </ThemeContext.Consumer>

    );
  }

}

export default App;
