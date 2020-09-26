import { Finger, Hand } from "./PhysicalKeyboard"


export const TrainingLevelFingers: Array<Finger[]> = [
  [Finger.THUMB, Finger.INDEX],
  [Finger.THUMB, Finger.INDEX, Finger.MIDDLE],
  [Finger.THUMB, Finger.INDEX, Finger.MIDDLE, Finger.RING],
  [Finger.THUMB, Finger.INDEX, Finger.MIDDLE, Finger.RING, Finger.PINKY],
]

export type GuidedCourseLevel = { description: string; rows: number[]; hand: Hand; fingers: Finger[] }

export const GuidedCourseLevels: GuidedCourseLevel[] = [
  { description: "Home row; left hand; index", rows: [2], hand: Hand.LEFT, fingers: [Finger.INDEX] },
  { description: "Home row; left hand; index, middle", rows: [2], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE] },
  { description: "Home row; left hand; index, middle, ring", rows: [2], hand: Hand.LEFT,fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING] },
  { description: "Home row; left hand; any", rows: [2], hand: Hand.LEFT, fingers: [Finger.ANY] },
  { description: "Home row; right hand; index", rows: [2], hand: Hand.LEFT, fingers: [Finger.INDEX] },
  { description: "Home row; right hand; index, middle", rows: [2], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE] },
  { description: "Home row; right hand; index, middle, ring", rows: [2], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING] },
  { description: "Home row; right hand; any", rows: [2], hand: Hand.LEFT, fingers: [Finger.ANY] },
  { description: "Home row; full", rows: [2], hand: Hand.ANY, fingers: [Finger.ANY] },
  { description: "Top row; left hand; index", rows: [1], hand: Hand.LEFT, fingers: [Finger.INDEX] },
  { description: "Top row; left hand; index, middle", rows: [1], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE] },
  { description: "Top row; left hand; index, middle, ring", rows: [1], hand: Hand.LEFT,fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING] },
  { description: "Top row; left hand; any", rows: [1], hand: Hand.LEFT, fingers: [Finger.ANY] },
  { description: "Top row; right hand; index", rows: [1], hand: Hand.LEFT, fingers: [Finger.INDEX] },
  { description: "Top row; right hand; index, middle", rows: [1], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE] },
  { description: "Top row; right hand; index, middle, ring", rows: [1], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING] },
  { description: "Top row; right hand; any", rows: [1], hand: Hand.LEFT, fingers: [Finger.ANY] },
  { description: "Top row; full", rows: [1], hand: Hand.ANY, fingers: [Finger.ANY] },
  { description: "Bottom row; left hand; index", rows: [3], hand: Hand.LEFT, fingers: [Finger.INDEX] },
  { description: "Bottom row; left hand; index, middle", rows: [3], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE] },
  { description: "Bottom row; left hand; index, middle, ring", rows: [3], hand: Hand.LEFT,fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING] },
  { description: "Bottom row; left hand; any", rows: [3], hand: Hand.LEFT, fingers: [Finger.ANY] },
  { description: "Bottom row; right hand; index", rows: [3], hand: Hand.LEFT, fingers: [Finger.INDEX] },
  { description: "Bottom row; right hand; index, middle", rows: [3], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE] },
  { description: "Bottom row; right hand; index, middle, ring", rows: [3], hand: Hand.LEFT, fingers: [Finger.INDEX, Finger.MIDDLE, Finger.RING] },
  { description: "Bottom row; right hand; any", rows: [3], hand: Hand.LEFT, fingers: [Finger.ANY] },
  { description: "Bottom row; full", rows: [3], hand: Hand.ANY, fingers: [Finger.ANY] },
  { description: "Home row; full", rows: [2], hand: Hand.ANY, fingers: [Finger.ANY] },
  { description: "Top row; full", rows: [1], hand: Hand.ANY, fingers: [Finger.ANY] },
  { description: "Home + Top full", rows: [1, 2], hand: Hand.ANY, fingers: [Finger.ANY]},
  { description: "Home + Bottome full", rows: [2, 3], hand: Hand.ANY, fingers: [Finger.ANY]},
  { description: "Full letters", rows: [1, 2, 3], hand: Hand.ANY, fingers: [Finger.ANY]},
  { description: "Full keyboard", rows: [0, 1, 2, 3], hand: Hand.ANY, fingers: [Finger.ANY]}
]
