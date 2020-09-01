import React from 'react'
import './FormattedText.css'

function FormattedText(props: { currentChar: number, trainingString: string, errorIndices: Set<number> }) {
  let { currentChar, trainingString, errorIndices } = props
  // trainingString = replaceSpaces(trainingString)
  let before: (JSX.Element | string)[] = []
  let current
  let after = tag(trainingString.slice(currentChar + 1), 'after')

  // Tag mistakes, up to but not including currentChar
  let start = 0
  for (let e of errorIndices) {
    if (e === currentChar) break
    before.push(tag(trainingString.slice(start, e), 'correct'))
    before.push(tag(trainingString[e], 'mistake'))
    start = e + 1
  }
  before.push(tag(trainingString.slice(start, currentChar), 'correct'))

  // Tag currentChar
  if (errorIndices.has(currentChar)) {
    current = tag(trainingString[currentChar], 'typo')
    setTimeout(() => {
      let typo = document.getElementsByClassName('typo')
      if (typo[0] != null) typo[0].className = 'currentChar'
    }, 750)
  } else {
    current = tag(trainingString[currentChar], 'currentChar')
  }

  return (
    <p>
      {before}
      {current}
      {after}
    </p>
  )

  function tag(str: string, className: string): JSX.Element {
    let retStr = format(str)
    return (<span className={className} dangerouslySetInnerHTML={{__html: retStr}}></span>)
  }
  function format(str: string): string {
    if (str != null)
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
    return str.replaceAll(" ", replacement)
  }
}

export default FormattedText