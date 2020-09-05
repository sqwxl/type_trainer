import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
`
const BigStat = styled.h1`
  color: ${props => props.color};
  height: 100%;
  line-height: 100%;
  margin-right: 0.5rem;
  padding: 0;
`
// const WPM = styled.h1`color: var(--mistake)`
const SmallStack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: end;
  text-align: right;
  margin: 0;
  margin-right: 0.5rem;
  padding: 0;
`
const SmallStackLabel = styled.p`
  margin: 0;
`
const Avg = styled.small`
  color: var(--text-secondary);
`

export default function QuickStats(props: any) {
  return (
    <Wrapper>
      <BigStat className="display-3" color={"var(--correct)"}>
        {props.sessionStats.wpm}
      </BigStat>
      <SmallStack>
        <SmallStackLabel>wpm</SmallStackLabel>
        <Avg>avg: {props.sessionStats.averages.wpm}</Avg>
      </SmallStack>
      <BigStat className="display-3" color={"var(--mistake)"}>
        {props.sessionStats.mistakes}
      </BigStat>
      <SmallStack>
        <SmallStackLabel> errors </SmallStackLabel> 
        <Avg>avg: {props.sessionStats.averages.mistakes}</Avg>
      </SmallStack>
    </Wrapper>
  )
}
