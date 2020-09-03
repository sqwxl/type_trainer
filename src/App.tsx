import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TypeTrainer } from './Components/TypeTrainer';

// let dict
// let loadDict = async function() { await fetch("./english_words_array.json").then(res => res.json()).then(data => {console.log(data);dict = data}).catch(err => console.log(err)) }
// loadDict()
// console.log(dict)
export const FontSizes: { [key: number]: string } = { 0: "1rem", 1: "1.5rem", 2: "2rem" }
function App() {
  return(
    <TypeTrainer />
  )
}
export default App;
