import React from 'react'
import { TrainingMode } from '../defaultState'
import './FormattedText.css'

const testId = "formattedString"
interface MyProps { greyed: boolean, cursor: number, trainingString: string, mistakeCharIndices: Set<number>, mode: TrainingMode }

export const FormattedText: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { cursor, trainingString, mistakeCharIndices } = props

  let uniquekey = 0
  function replaceSpaces(str: string): string {
    const lineFeed = `&crarr;<br>`
    const blankAndInvisibleSpace = `&blank;&#8203;`
    return str.replace(/\n/g, lineFeed).replace(/\s/g, blankAndInvisibleSpace)
  }
  function escapeHtml(unsafe: string): string {
    const text = document.createTextNode(unsafe);
    const p = document.createElement('p');
    p.appendChild(text);
    const safe = p.innerHTML
    p.remove()
    return safe
  }
  function format(str: string): string {
    if (str != null)
      return replaceSpaces(escapeHtml(str))
    else
      return ""
  }
  function tag(str: string, className: string): JSX.Element {
    const retStr = format(str)
    return (<span key={className+uniquekey++} className={className} dangerouslySetInnerHTML={{__html: retStr}}></span>)
  }

  //edge case (easter egg)
  if (trainingString === "" || trainingString.split("").every(v => v === " ")) return (<p data-testid={testId}><span role="img" aria-label="shrugging woman">🤷</span></p>)

  // trainingString = replaceSpaces(trainingString)
  const before: (JSX.Element | string)[] = []
  let current
  const after = tag(trainingString.slice(cursor + 1), 'after')

  // Tag mistakes, up to but not including cursor
  let start = 0
  for (const e of mistakeCharIndices) {
    if (e === cursor) break
    before.push(tag(trainingString.slice(start, e), 'correct'))
    before.push(tag(trainingString[e], 'mistake'))
    start = e + 1
  }
  before.push(tag(trainingString.slice(start, cursor), 'correct'))

  // Tag cursor
  if (mistakeCharIndices.has(cursor)) {
    current = tag(trainingString[cursor], 'typo')
    setTimeout(() => {
      const typo = document.getElementsByClassName('typo')
      if (typo[0] != null) typo[0].className = 'cursor'
    }, 750)
  } else {
    current = tag(trainingString[cursor], 'cursor')
  }

  return (
    <p data-testid={testId} className={props.greyed ? "greyed" : ""} style={props.mode === TrainingMode.CODE ? {textAlign: "left"} : {}}>
      {before}
      {current}
      {after}
    </p>
  )

}

export default FormattedText