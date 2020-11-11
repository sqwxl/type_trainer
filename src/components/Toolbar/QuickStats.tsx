import React from "react"
import styled from "styled-components"
import { TrainingMode } from "../defaultState"

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

interface MyProps {
  mode: TrainingMode
  wordsPerMinute: number
  wordsPerMinuteAverage: number
  successRate: number
  successRateAverage: number
  guidedLevelIndex: number
  levelDescription: string
}

const QuickStats: React.FC<MyProps> = props => {
  return (
    <Wrapper>
      <BigStat className="display-3" color={"var(--correct)"}>
        {props.wordsPerMinute}
      </BigStat>
      <SmallStack>
        <SmallStackLabel>wpm</SmallStackLabel>
        <Avg>avg: {props.wordsPerMinuteAverage}</Avg>
      </SmallStack>
      <BigStat className="display-3" color={"var(--mistake)"}>
        {props.successRate}
      </BigStat>
      <SmallStack>
        <SmallStackLabel> % correct</SmallStackLabel>
        <Avg>avg: {props.successRateAverage}</Avg>
      </SmallStack>
      {props.mode !== TrainingMode.GUIDED || <div><BigStat className="display-3" >level: {props.guidedLevelIndex}</BigStat>
      <SmallStack>{props.levelDescription}</SmallStack>
        </div>}
    </Wrapper>
  )
}

export default QuickStats
