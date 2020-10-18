import React from 'react'
import { Button } from 'react-bootstrap'
import { InlineIcon } from '@iconify/react';
import bxFontSize from '@iconify/icons-bx/bx-font-size';
import styled from 'styled-components'


const StyledButton = styled(Button)`
  height: 1.75rem;
  margin: 0 0.5rem;
`
export default function FontSizeSelect(props: { toggleFn: any }) {
  return (
    <StyledButton size="sm" onClick={props.toggleFn}>
      <InlineIcon height="1.4rem" icon={bxFontSize} />
    </StyledButton >)
}