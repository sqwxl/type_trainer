import React from "react";
import { Form, FormControl, FormLabel } from "react-bootstrap";

export default function StringLengthSelect(props : any) {
  function handleChange(e: React.ChangeEvent) {
    if (e.target == null) return
    const target = e.target as HTMLInputElement
    props.updateFn(target.value as string)
  }
  return (
    <Form>
      <FormLabel>Length: </FormLabel>
      <FormControl type="number" defaultValue={props.value} onChange={handleChange}></FormControl>
    </Form>
  )
}