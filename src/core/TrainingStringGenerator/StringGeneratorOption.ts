
export type FormType = "PARENT" | "SWITCH" | "NUMBER" | "TEXT" | "SELECT"

export interface StringGeneratorOptions {
  [key: string]: StringGeneratorOption
}
export class StringGeneratorOption {
  value: boolean | number | string | StringGeneratorOptions;
  formLabel: string;
  formType: FormType;
  min: number;
  max: number;
  step: number;
  values: string[];

  constructor({ value, formLabel, formType, min, max, step, values }: {
    value: boolean | number | string | StringGeneratorOptions;
    formLabel: string;
    formType: FormType;
    min?: number;
    max?: number;
    step?: number;
    values?: string[];
  }) {
    this.value = value;
    this.formLabel = formLabel;
    this.formType = formType;
    this.min = min == null ? 0 : min;
    this.max = max == null ? 100 : max;
    this.step = step == null ? 1 : step;
    this.values = values == null ? [] : values;
  }
  setNestedOption(name: string, value: boolean | number | string | StringGeneratorOptions): boolean {
    if (isUserStringOptions(this.value)) {
      if (name in this.value) {
        this.value[name].value = value;
        return true;
      } else {
        Object.values(this.value).forEach(userStringOption => userStringOption.setNestedOption(name, value));
      }
    }
    return false;
    function isUserStringOptions(value: boolean | number | string | StringGeneratorOptions): value is StringGeneratorOptions {
      return (
        (value as StringGeneratorOptions) !== undefined &&
        Object.values(value as StringGeneratorOptions).some(val => val.value !== undefined || isUserStringOptions(val.value))
      );
    }
  }
}
