import {
    ask,
    getVar,
    add,
    and,
    equal,
    less,
    mul,
    nat,
    notEqual,
    or
} from './mindFlow.js'

test('if x = 5 then x = 5', () => {
    const x = getVar()
    const answers = ask([x], equal(x, 5))

    expect(answers.next().value).toEqual([5])
    expect(answers.next().done).toBe(true)
})

test('if x = 5 and y = z and z = 5 then [x, y, z] = [5, 5, 5]', () => {
    const x = getVar()
    const y = getVar()
    const z = getVar()
    const answers = ask([x, y, z], and(equal(x, y), equal(y, z), equal(z, 5)))

    expect(answers.next().value).toEqual([5, 5, 5])
    expect(answers.next().done).toBe(true)
})

test('if x = 1 or x = 2 or x = 3 then x = (1 or 2 or 3)', () => {
    const x = getVar()
    const answers = ask([x], or(equal(x, 1), equal(x, 2), equal(x, 3)))

    expect(answers.next().value).toEqual([1])
    expect(answers.next().value).toEqual([2])
    expect(answers.next().value).toEqual([3])
    expect(answers.next().done).toBe(true)
})

test('if (x = 1 or x = 2) and x != 1 then x = 2', () => {
    const x = getVar()
    const answers = ask([x], and(or(equal(x, 1), equal(x, 2)), notEqual(x, 1)))

    expect(answers.next().value).toEqual([2])
    expect(answers.next().done).toBe(true)
})

test('if (x = 1 or x = 2 or x = 3) and x < 3 then x = (1 or 2)', () => {
    const x = getVar()
    const answers = ask(
        [x],
        and(or(equal(x, 1), equal(x, 2), equal(x, 3)), less(x, 3))
    )

    expect(answers.next().value).toEqual([1])
    expect(answers.next().value).toEqual([2])
    expect(answers.next().done).toBe(true)
})

test('if x = 2 + 8 then x = 10', () => {
    const x = getVar()
    const answers = ask([x], add(2, 8, x))

    expect(answers.next().value).toEqual([10])
    expect(answers.next().done).toBe(true)
})

test('if x = 4 * 8 then x = 32', () => {
    const x = getVar()
    const answers = ask([x], mul(4, 8, x))

    expect(answers.next().value).toEqual([32])
    expect(answers.next().done).toBe(true)
})

test('if [x, [8, z, 10], []] = [4, [y, 1, 10], []] then x = 4 and y = 8, z = 1', () => {
    const x = getVar()
    const y = getVar()
    const z = getVar()
    const answers = ask(
        [x, y, z],
        equal([x, [8, z, 10], []], [4, [y, 1, 10], []])
    )

    expect(answers.next().value).toEqual([4, 8, 1])
    expect(answers.next().done).toBe(true)
})

test('nat(x)', () => {
    const x = getVar()
    x.name = 'test'
    const answers = ask([x], nat(x))

    expect(answers.next().value).toEqual([0])
    expect(answers.next().value).toEqual([1])
    expect(answers.next().value).toEqual([2])
    expect(answers.next().done).toBe(false)
})
