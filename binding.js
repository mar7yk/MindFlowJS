export default class Binding {
    constructor(variable, value) {
        this.variable = variable
        this.value = value
    }
}

Binding.prototype.type = 'binding'
