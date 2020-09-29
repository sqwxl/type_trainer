import React from "react"
import styled from 'styled-components'

const Wrapper = styled.nav`
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: end;
  margin: 0.5rem 0;
`

const ToolbarLeft = styled.div`
  height: 100%;
  display: flex;
`
const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
`

export default function Toolbar(props: { left: JSX.Element | JSX.Element[], right: JSX.Element | JSX.Element[] }): JSX.Element {
  return (
    <Wrapper>
      <ToolbarLeft key="left">{props.left}</ToolbarLeft>
      <ToolbarRight key="right">{props.right}</ToolbarRight>
    </Wrapper>
  )
}
