import Frame from './frame.js'
import { getVar } from './logicVariable.js'

export { getVar }

export function* ask(vars, goal, limit = Infinity) {
    let iter = 0
    for (const frame of goal()(new Frame())) {
        yield frame.walkAll(vars)
        if (++iter === limit) return
    }
}

export function check(goal) {
    return !ask([], goal).next().done
}

export function and(...constraints) {
    return () =>
        function* andConstraint(frame) {
            if (constraints.length === 0) yield frame
            else
                for (const newFrame of constraints[0]()(frame)) {
                    yield* and(...constraints.slice(1))()(newFrame)
                }
        }
}

export const or =
    (...constraints) =>
    () =>
        function* orConstraint(frame) {
            for (const constraint of constraints) {
                yield* constraint()(frame)
            }
        }

export const not = constraint => () =>
    function* notConstraint(frame) {
        if (constraint()(frame).next().done) yield frame
    }

export const equal = (x, y) => () =>
    function* equalConstraint(frame) {
        const a = frame.walk(x)
        const b = frame.walk(y)

        if (a === b) yield frame
        else if (a.type === 'ask_logic_variable') yield frame.extend(a, b)
        else if (b.type === 'ask_logic_variable') yield frame.extend(b, a)
        else if (
            a[Symbol.iterator] !== undefined &&
            b[Symbol.iterator] !== undefined
        ) {
            // eslint-disable-next-line no-use-before-define
            yield* equalIterable(a, b)()(frame)
        }
    }

const equalIterable = (x, y) => () =>
    function* equalConstraint(frame) {
        const iterator1 = x[Symbol.iterator]()
        const iterator2 = y[Symbol.iterator]()

        const toEquals = []

        for (const item1 of iterator1) {
            const ii = iterator2.next()
            if (ii.done) return

            const item2 = ii.value
            toEquals.push(equal(item1, item2))
        }

        if (!iterator2.next().done) return

        yield* and(...toEquals)()(frame)
    }

export const notEqual = (x, y) => not(equal(x, y))

export const less = (x, y) => () =>
    function* equalConstraint(frame) {
        const a = frame.walk(x)
        const b = frame.walk(y)

        if (a < b) yield frame
    }

export const greater = (x, y) => () =>
    function* equalConstraint(frame) {
        const a = frame.walk(x)
        const b = frame.walk(y)

        if (a > b) yield frame
    }

export const lessOrEqual = (x, y) => greater(y, x)

export const greaterOrEqual = (x, y) => less(y, x)

export const add = (x, y, z) => () =>
    function* addConstraint(frame) {
        const a = frame.walk(x)
        const b = frame.walk(y)
        const c = frame.walk(z)

        const aIsVar = a.type === 'ask_logic_variable'
        const bIsVar = b.type === 'ask_logic_variable'
        const cIsVar = c.type === 'ask_logic_variable'

        if (aIsVar + bIsVar + cIsVar > 1) return

        if (aIsVar) yield frame.extend(a, c - b)
        else if (bIsVar) yield frame.extend(b, c - a)
        else if (cIsVar) yield frame.extend(c, a + b)
    }

export const sub = (x, y, z) => add(z, y, x)

export const mul = (x, y, z) => () =>
    function* addConstraint(frame) {
        const a = frame.walk(x)
        const b = frame.walk(y)
        const c = frame.walk(z)

        const aIsVar = a.type === 'ask_logic_variable'
        const bIsVar = b.type === 'ask_logic_variable'
        const cIsVar = c.type === 'ask_logic_variable'

        if (aIsVar + bIsVar + cIsVar > 1) return

        if (aIsVar) yield frame.extend(a, c / b)
        else if (bIsVar) yield frame.extend(b, c / a)
        else if (cIsVar) yield frame.extend(c, a * b)
    }

export const div = (x, y, z) => mul(z, y, x)

export const nat = x => () =>
    function* natConstraint(frame) {
        for (let i = 0; ; i++) {
            yield frame.extend(x, i)
        }
    }

export const int = x => () =>
    function* intConstraint(frame) {
        yield frame.extend(x, 0)
        for (let i = 1; ; i++) {
            yield frame.extend(x, i)
            yield frame.extend(x, -i)
        }
    }

export const between = (x, y, r) => () =>
    function* betweenConstraint(frame) {
        for (let i = x; i <= y; i++) {
            yield frame.extend(r, i)
        }
    }

export const pairs = (x, y) => () =>
    function* pairsConstraint(frame) {
        for (let i = 0; ; i++) {
            for (let j = 0; j <= i; j++) {
                yield frame.extend(x, j).extend(y, i - j)
            }
        }
    }
