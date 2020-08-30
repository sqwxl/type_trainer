import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import './Keyboard.css'
import { LayoutContext } from '../Contexts/LayoutContext/LayoutContext';
import { ThemeContext } from '../Contexts/ThemeContext/ThemeContext';

interface KeyBtnData {
  code: string;
  key: string;
  label?: string;
  class?: string[];
}

export default function Keyboard(props: any) {
  const theme = useContext(ThemeContext)
  const layout = useContext(LayoutContext)

  let pressed = props.pressed
  let keys: JSX.Element[] = [];
  for (let [idx, keyRow] of layout.entries()) {
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
      if (pressed.length && pressed.includes(keyBtnData.code)) classes.push("pressed")
      if (keyBtnData.class)
        classes.push(...keyBtnData.class);
      row.push(<li id={keyBtnData.code} key={keyBtnData.code} className={classes.join(" ")} dangerouslySetInnerHTML={label}></li>);
    });
    keys.push(<ul key={"row-" + idx} className={"keyboard-flex-row row-" + idx}>{row}</ul>);
  }
  return (
    // <ThemeContext.Consumer>
    //   {theme =>
        <Container>
      <div className={"keyboard"} style={theme} id="keyboard" data-testid="keyboard">
            {keys}
          </div>
        </Container>
    //   }
    // </ThemeContext.Consumer>);
  )
}

