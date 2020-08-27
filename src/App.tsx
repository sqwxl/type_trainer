import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Keyboard } from './Components/Keyboard/Keyboard';
import layout from "./Components/Keyboard/layouts/layout_enUS_linux";
import { Textarea } from './Components/Textarea/Textarea';

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
  }
  render() {
    return (
      <div className="App">
        <Textarea displayText={this.state.displayText}></Textarea>
        <Keyboard layout={layout} />
      </div>
    );
  }

}

export default App;
