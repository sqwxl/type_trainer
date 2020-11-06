export type FormType = "SWITCH" | "NUMBER" | "TEXT" | "SELECT"


export class OptionCategory {
  constructor() {}
}

export class StringGeneratorOption {
  value: boolean | number | string | StringGeneratorOption;
  formLabel: string;
  formType: FormType;
  min: number;
  max: number;
  step: number;
  values: string[];

  constructor({ value, formLabel, formType, min, max, step, values }: {
    value: boolean | number | string | StringGeneratorOption;
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
  formSchema() {
    
  }
  setNestedOption(name: string, value: boolean | number | string | StringGeneratorOption): boolean {
    if (this.value instanceof StringGeneratorOption) {
      if (name in this.value) {
        this.value[name].value = value;
        return true;
      } else {
        Object.values(this.value).forEach(userStringOption => userStringOption.setNestedOption(name, value));
      }
    }
    return false;
    }
  }
}
