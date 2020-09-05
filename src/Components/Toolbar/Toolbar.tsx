import React from "react"
import styled from 'styled-components'

const Wrapper = styled.nav`
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin: 0.5rem 0;
`

const ToolbarLeft = styled.div`
  height: 100%;
  display: flex;
`
const ToolbarRight = styled.div`
  display: flex;
`

export default function Toolbar(props: any) {
  return (
    <Wrapper>
      <ToolbarLeft>{props.left}</ToolbarLeft>
      <ToolbarRight>{props.right}</ToolbarRight>
    </Wrapper>
  )
}
