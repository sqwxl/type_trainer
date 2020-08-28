import React from 'react';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Keyboard from './Components/Keyboard/Keyboard';
import { Textarea, TextareaProps } from './Components/Textarea/Textarea';
import { ThemeContext, themes } from './Components/Providers/ThemeProvider/ThemeContext';
import { LayoutContext, layouts } from './Components/Providers/LayoutProvider/LayoutContext';


interface AppProps { }
interface AppState {
  displayText: string
}
const INITIALSTATE: AppState = {
  displayText: ""
}

class App extends React.Component<{}, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.state = INITIALSTATE
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress(event: KeyboardEvent) {
    event.preventDefault()
    console.dir(event)
  }

  render() {
    return (
      <div className="App" >
        <Textarea displayText={this.state.displayText}></Textarea>
        <Keyboard />
      </div>
    );
  }

}

export default App;
