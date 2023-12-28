export default class List {
    static EMPTY = new List()

    constructor(first = null, rest = List.EMPTY) {
        this.head = first
        this.teal = rest
    }

    get first() {
        return this.head
    }

    get rest() {
        return this.teal
    }

    isEmpty() {
        return this.first === null
    }

    foreach(callBack) {
        if (this.isEmpty()) return

        callBack(this.first)
        this.rest.foreach(callBack)
    }

    map(callBack) {
        if (this.isEmpty()) return List.EMPTY

        return new this.constructor(
            callBack(this.first),
            this.rest.map(callBack)
        )
    }

    append(other) {
        if (this.isEmpty()) return other

        return new this.constructor(this.first, this.rest.append(other))
    }

    extend(value) {
        return new this.constructor(value, this)
    }
}

List.prototype.type = 'list'
