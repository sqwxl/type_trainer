import { defaultSessionOptions } from "../../Components/TypeTrainer"
import { MarkovTrainingStringGenerator } from "../TrainingStringGenerator"
import dict from "../../english_words_array.json";
describe("TrainingStringGenerator", () => {
  it("should generate some string", () => {
      const generator = new MarkovTrainingStringGenerator(dict.dict)
      const str = generator.generate(defaultSessionOptions)
      console.log(str)
      expect(str.length).not.toBeFalsy()
  })
})