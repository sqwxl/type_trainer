import React from 'react'
import './FormattedText.css'

function FormattedText(props: { greyed: boolean, cursor: number, trainingString: string, mistakes: Set<number> }) {
  let { cursor, trainingString, mistakes } = props

  //edge case (easter egg)
  if (trainingString === "") return (<p><span role="img" aria-label="shrugging woman">🤷</span></p>)

  // trainingString = replaceSpaces(trainingString)
  let before: (JSX.Element | string)[] = []
  let current
  let after = tag(trainingString.slice(cursor + 1), 'after')

  // Tag mistakes, up to but not including cursor
  let start = 0
  for (let e of mistakes) {
    if (e === cursor) break
    before.push(tag(trainingString.slice(start, e), 'correct'))
    before.push(tag(trainingString[e], 'mistake'))
    start = e + 1
  }
  before.push(tag(trainingString.slice(start, cursor), 'correct'))

  // Tag cursor
  if (mistakes.has(cursor)) {
    current = tag(trainingString[cursor], 'typo')
    setTimeout(() => {
      let typo = document.getElementsByClassName('typo')
      if (typo[0] != null) typo[0].className = 'cursor'
    }, 750)
  } else {
    current = tag(trainingString[cursor], 'cursor')
  }

  return (
    <p className={props.greyed ? "greyed" : ""}>
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