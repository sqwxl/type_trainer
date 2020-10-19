import React from 'react'
import { Button } from 'react-bootstrap'
import { InlineIcon } from '@iconify/react';
import bxFontSize from '@iconify/icons-bx/bx-font-size';

export default function FontSizeSelect(props: { toggleFn: any }) {
  return (
    <Button onClick={props.toggleFn}>
      <InlineIcon height="1rem" icon={bxFontSize} />
    </Button >)
}