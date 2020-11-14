export const setNestedProp = (obj: {[key: string]: any} = {}, [first, ...rest]: string[] , value: any): any => {
    return ({ ...obj, [first]: rest.length ? setNestedProp(obj[first], rest, value) : value })
  }

export const localStorageAvailable = () => {
  var storage
  try {
    storage = window.localStorage
    var x = "__storage_test__"
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}