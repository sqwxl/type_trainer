import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TypeTrainer } from './Components/TypeTrainer';

// let dict
// let loadDict = async function() { await fetch("./english_words_array.json").then(res => res.json()).then(data => {console.log(data);dict = data}).catch(err => console.log(err)) }
// loadDict()
// console.log(dict)
function App() {
  return(
    <TypeTrainer />
  )
}
export default App;
