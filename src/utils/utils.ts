export const setNestedProp = (obj: {[key: string]: any} = {}, [first, ...rest]: string[] , value: any): any => {
    console.log()
    return ({ ...obj, [first]: rest.length ? setNestedProp(obj[first], rest, value) : value })
  }