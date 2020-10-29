import * as defaults from './defaultState'

describe('Default state variables and classes', () => {
    test('UserStringOption can set nested options', () => {
        let options = defaults.defaultGuidedModeStringOptions
        expect((options.wordModifierOptions.value as defaults.UserStringOptions).caps.value).toBeFalsy()
        options.wordModifierOptions.setNestedOption('caps', true)
        expect((options.wordModifierOptions.value as defaults.UserStringOptions).caps.value).toBeTruthy()
    })
})