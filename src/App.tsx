import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TypeTrainer } from './components/TypeTrainer';
import { GuidedModeStringGenerator } from './core/TrainingStringGenerator/TrainingStringGenerator';
import { dict } from './assets/Dictionaries/english.json'

// let dict
// let loadDict = async function() { await fetch("./english_words_array.json").then(res => res.json()).then(data => {console.log(data);dict = data}).catch(err => console.log(err)) }
// loadDict()
// console.log(dict)
function App(): JSX.Element {
  return(
    <TypeTrainer />
  )
}
export default App;
