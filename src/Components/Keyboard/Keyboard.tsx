import React from 'react';
import Container from 'react-bootstrap/Container';
import './Keyboard.css'

interface KeyBtnData {
  code: string;
  key: string;
  label?: string;
  class?: string[];
}

export default function Keyboard(props: { layout: KeyBtnData[][] }): JSX.Element {
  let keys: JSX.Element[] = [];
  for (let [idx, keyRow] of props.layout.entries()) {
    let row: JSX.Element[] = [];
    keyRow.forEach((keyBtnData: KeyBtnData) => {
      let label: {
        __html: string;
      };
      if (keyBtnData.label) {
        label = { __html: keyBtnData.label };
      }
      else {
        label = { __html: keyBtnData.key };
      }
      let classes = ["key-btn"];
      classes.push("row-item-" + idx);
      if (keyBtnData.class)
        classes.push(...keyBtnData.class);
      row.push(<li id={keyBtnData.code} key={keyBtnData.code} className={classes.join(" ")} dangerouslySetInnerHTML={label}></li>);
    });
    keys.push(<ul key={"row-" + idx} className={"keyboard-flex-row row-" + idx}>{row}<div style={{ clear: "left" }}></div></ul>);
  }
  return (<Container>
    <div className="keyboard">
      {keys}
    </div>
  </Container>);
}
