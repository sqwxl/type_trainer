import * as defaults from './defaultState'

describe('Default state variables and classes', () => {
    test('UserStringOption can set nested options', () => {
        let options = defaults.defaultGuidedModeStringOptions
        expect((options.wordModifierOptions.value as defaults.UserStringOptions).caps.value).toBeFalsy()
        console.log(defaults.UserStringOption.setOption(options, 'caps', true))
        expect((options.wordModifierOptions.value as defaults.UserStringOptions).caps.value).toBeTruthy()
    })
})