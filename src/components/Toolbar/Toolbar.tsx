import React from "react"
import styled from 'styled-components'

const Wrapper = styled.nav`
  height: 4rem;
  display: flex;
  justify-content: space-around;
  align-items: end;
  margin: 0.5rem 0;
`

const ToolbarLeft = styled.div`
  height: 100%;
  display: flex;
`
const ToolbarRight = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`

export default function Toolbar(props: { stats: JSX.Element, buttons: JSX.Element[] }): JSX.Element {
  return (
    <Wrapper>
      <ToolbarLeft key="stats">{props.stats}</ToolbarLeft>
      <ToolbarRight key="buttons">{props.buttons}</ToolbarRight>
    </Wrapper>
  )
}
