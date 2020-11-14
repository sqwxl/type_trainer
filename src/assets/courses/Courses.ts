import { Hand, Finger } from "../../core/Keyboard"


export interface CourseLevel {
  description: string
  keyBoardRows: number[]
  hand: Hand
  fingers: Finger[]
}
export type Course = {
  name: string
  description: string
  levels: CourseLevel[]
}

/* const Fingers: Course = {
  name: "Finger by finger",
  description: "TODO",
  levels: [
    { description: "Both indexes", hand: Hand.ANY, fingers: [Finger.THUMB, Finger.INDEX] },
    { description: "Both indexes", hand: Hand.ANY, fingers: [Finger.THUMB, Finger.INDEX, Finger.MIDDLE] },
    { description: "Both indexes", hand: Hand.ANY, fingers: [Finger.THUMB, Finger.INDEX, Finger.MIDDLE, Finger.RING] },
    { description: "Both indexes", hand: Hand.ANY, fingers: [Finger.ANY] },
  ],
} */

const GuidedCourse: Course = {
  name: "Guided Course",
  description: "TODO",
  levels: [
    { description: "Home row; left hand; index", keyBoardRows: [2], hand: Hand.LEFT, fingers: [Finger.INDEX] },
    {
      description: "Home row; left hand; index, middle",
      keyBoardRows: [2],
      hand: Hand.LEFT,
      fingers: [Finger.INDEX, Finger.MIDDLE],
    },
    {
      description: "Home row; left hand; index, middle, ring",
      keyBoardRows: [2],
      hand: Hand.LEFT,
      fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING],
    },
    { description: "Home row; left hand; any", keyBoardRows: [2], hand: Hand.LEFT, fingers: [Finger.ANY] },
    { description: "Home row; right hand; index", keyBoardRows: [2], hand: Hand.RIGHT, fingers: [Finger.INDEX] },
    {
      description: "Home row; right hand; index, middle",
      keyBoardRows: [2],
      hand: Hand.RIGHT,
      fingers: [Finger.INDEX, Finger.MIDDLE],
    },
    { description: "Home row; right hand; any", keyBoardRows: [2], hand: Hand.RIGHT, fingers: [Finger.ANY] },
    { description: "Home row; full", keyBoardRows: [2], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Top row; left hand; index", keyBoardRows: [1], hand: Hand.LEFT, fingers: [Finger.INDEX] },
    {
      description: "Top row; left hand; index, middle",
      keyBoardRows: [1],
      hand: Hand.LEFT,
      fingers: [Finger.INDEX, Finger.MIDDLE],
    },
    {
      description: "Top row; left hand; index, middle, ring",
      keyBoardRows: [1],
      hand: Hand.LEFT,
      fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING],
    },
    { description: "Top row; left hand; any", keyBoardRows: [1], hand: Hand.LEFT, fingers: [Finger.ANY] },
    { description: "Top row; right hand; index", keyBoardRows: [1], hand: Hand.RIGHT, fingers: [Finger.INDEX] },
    {
      description: "Top row; right hand; index, middle",
      keyBoardRows: [1],
      hand: Hand.RIGHT,
      fingers: [Finger.INDEX, Finger.MIDDLE],
    },
    {
      description: "Top row; right hand; index, middle, ring",
      keyBoardRows: [1],
      hand: Hand.RIGHT,
      fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING],
    },
    { description: "Top row; right hand; any", keyBoardRows: [1], hand: Hand.RIGHT, fingers: [Finger.ANY] },
    { description: "Top row; full", keyBoardRows: [1], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Bottom row; left hand; index", keyBoardRows: [3], hand: Hand.LEFT, fingers: [Finger.INDEX] },
    {
      description: "Bottom row; left hand; index, middle",
      keyBoardRows: [3],
      hand: Hand.LEFT,
      fingers: [Finger.INDEX, Finger.MIDDLE],
    },
    {
      description: "Bottom row; left hand; index, middle, ring",
      keyBoardRows: [3],
      hand: Hand.LEFT,
      fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING],
    },
    { description: "Bottom row; left hand; any", keyBoardRows: [3], hand: Hand.LEFT, fingers: [Finger.ANY] },
    { description: "Bottom row; right hand; index", keyBoardRows: [3], hand: Hand.RIGHT, fingers: [Finger.INDEX] },
    {
      description: "Bottom row; right hand; index, middle",
      keyBoardRows: [3],
      hand: Hand.RIGHT,
      fingers: [Finger.INDEX, Finger.MIDDLE],
    },
    {
      description: "Bottom row; right hand; index, middle, ring",
      keyBoardRows: [3],
      hand: Hand.RIGHT,
      fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING],
    },
    { description: "Bottom row; right hand; any", keyBoardRows: [3], hand: Hand.RIGHT, fingers: [Finger.ANY] },
    { description: "Bottom row; full", keyBoardRows: [3], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Home row; full", keyBoardRows: [2], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Top row; full", keyBoardRows: [1], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Home + Top full", keyBoardRows: [1, 2], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Home + Bottome full", keyBoardRows: [2, 3], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Full letters", keyBoardRows: [1, 2, 3], hand: Hand.ANY, fingers: [Finger.ANY] },
    { description: "Full keyboard", keyBoardRows: [0, 1, 2, 3], hand: Hand.ANY, fingers: [Finger.ANY] },
  ],
}
const Courses = { guidedCourse: GuidedCourse }
export default Courses
