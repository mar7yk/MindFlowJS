import Binding from './binding.js'
import List from './list.js'

export default class Frame extends List {
    static EMPTY = new Frame()

    constructor(first = null, rest = Frame.EMPTY) {
        super(first, rest)
    }

    extend(variable, value) {
        const binding = new Binding(variable, value)
        return super.extend(binding)
    }

    walkAll(variables) {
        const result = []
        for (const variable of variables) {
            const value = this.walk(variable)
            if (value === undefined) return false

            result.push(value)
        }

        return result
    }

    walk(variable) {
        if (variable.type !== 'ask_logic_variable') return variable

        const binding = this.lookupBinding(variable)
        if (binding !== undefined) return this.walk(binding.value)

        return variable
    }

    lookupBinding(variable) {
        let frame = this
        while (!frame.isEmpty()) {
            if (frame.first.variable === variable) return frame.first

            frame = frame.rest
        }

        return undefined
    }
}
