import Frame from './frame.js'
import { getVar } from './logicVariable.js'

export { getVar }

export function* ask(vars, goal, limit = Infinity) {
    let iter = 0
    for (const frame of goal()(new Frame())) {
        const result = frame.walkAll(vars)
        yield result.length ? result : true
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

export const oneOf =
    (...constraints) =>
    () =>
        function* oneOfConstraint(frame) {
            for (const constraint of constraints) {
                let isGood = false
                for (const newFrame of constraint()(frame)) {
                    isGood = true
                    yield newFrame
                }
                if (isGood) return
            }
        }

export const not = constraint => () =>
    function* notConstraint(frame) {
        if (constraint()(frame).next().done) yield frame
    }

export const equal = (x, y) => () =>
    function* equalConstraint(frame) {
        let a = frame.walk(x)
        let b = frame.walk(y)

        if (b.type === 'ask_logic_variable') [a, b] = [b, a]

        if (a === b) yield frame
        else if (a.type === 'ask_logic_variable') {
            if (b[Symbol.iterator] !== undefined) b = frame.walkAll(b)
            yield frame.extend(a, b)
        } else if (
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
    function* lessConstraint(frame) {
        const a = frame.walk(x)
        const b = frame.walk(y)

        if (a < b) yield frame
    }

export const greater = (x, y) => () =>
    function* greaterConstraint(frame) {
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

export const mod = (x, y, z) => () =>
    function* addConstraint(frame) {
        const a = frame.walk(x)
        const b = frame.walk(y)
        const c = frame.walk(z)

        if (a.type === 'ask_logic_variable') return
        if (b.type === 'ask_logic_variable') return

        yield frame.extend(c, a % b)
    }

export const between = (begin, end, r) => () =>
    function* betweenConstraint(frame) {
        const b = frame.walk(begin)
        if (b.type === 'ask_logic_variable') return
        const e = frame.walk(end)
        if (e.type === 'ask_logic_variable') return

        for (let i = b; i <= e; i++) {
            yield* equal(r, i)()(frame)
        }
    }

export const nat = x => between(0, Infinity, x)

export const num = x => between(1, Infinity, x)

export function int(x) {
    const x1 = getVar()
    return or(equal(x, 0), and(num(x1), or(equal(x, x1), add(x, x1, 0))))
}

export const member = (list, item) => () =>
    function* memberConstraint(frame) {
        const l = frame.walk(list)
        if (l[Symbol.iterator] === undefined) return
        for (const i of l) {
            yield* equal(item, i)()(frame)
        }
    }

export const getMember = (input, output, parm) => () =>
    function* getMemberConstraint(frame) {
        const i = frame.walk(input)

        if (i[parm] === undefined) return
        const o = i[parm]

        yield* equal(output, o)()(frame)
    }

const length = (list, x) => getMember(list, x, 'length')

export const execMethod =
    (input, output, methodName, ...parms) =>
    () =>
        function* execMethodConstraint(frame) {
            const i = frame.walk(input)

            if (i[methodName] === undefined) return
            const o = i[methodName](...frame.walkAll(parms))
            if (o === undefined) return

            yield* equal(output, o)()(frame)
        }

export const execFunc =
    (output, func, ...parms) =>
    () =>
        function* execFuncConstraint(frame) {
            const o = func(...frame.walkAll(parms))
            if (o === undefined) return

            yield* equal(output, o)()(frame)
        }

function genTupleWhitSum(sum, ...items) {
    const s1 = getVar()
    const k = getVar()
    return () =>
        and(
            length(items, k),
            oneOf(
                and(equal(k, 1), equal(items[0], sum)),
                and(
                    between(0, sum, items[0]),
                    sub(sum, items[0], s1),
                    genTupleWhitSum(s1, ...items.slice(1))
                )
            )
        )()
}

export function tuple(...items) {
    const sum = getVar()
    return and(nat(sum), genTupleWhitSum(sum, ...items))
}
