import {
    ask,
    getVar,
    add,
    and,
    equal,
    less,
    mul,
    between,
    nat,
    notEqual,
    or,
    int,
    num,
    execMethod,
    getMember,
    member,
    execFunc,
    tuple,
    mod,
    check
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

test('if x = 25 % 7 then x = 4', () => {
    const x = getVar()
    const answers = ask([x], mod(25, 7, x))

    expect(answers.next().value).toEqual([4])
    expect(answers.next().done).toBe(true)
})

test('if 25 % 7 = 4', () => {
    expect(check(mod(25, 7, 4))).toEqual(true)
})

test('if 25 % 7 != 5', () => {
    expect(check(mod(25, 7, 5))).toEqual(false)
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

test('if x = 8 and y = [x] then y = [8]', () => {
    const x = getVar()
    const y = getVar()
    const answers = ask([y], and(equal(x, 8), equal(y, [x])))

    expect(answers.next().value).toEqual([[8]])
    expect(answers.next().done).toBe(true)
})

test('if x = 50 and num(x) then x = 50', () => {
    const x = getVar()
    const answers = ask([x], equal(x, 50), num(x))

    expect(answers.next().value).toEqual([50])
    expect(answers.next().done).toBe(true)
})

test('nat(x)', () => {
    const x = getVar()
    const answers = ask([x], nat(x))

    expect(answers.next().value).toEqual([0])
    expect(answers.next().value).toEqual([1])
    expect(answers.next().value).toEqual([2])
    expect(answers.next().done).toBe(false)
})

test('between(1, 3)', () => {
    const x = getVar()
    const y = getVar()
    const z = getVar()
    const answers = ask([x], and(equal(y, 1), equal(z, 3), between(y, z, x)))

    expect(answers.next().value).toEqual([1])
    expect(answers.next().value).toEqual([2])
    expect(answers.next().value).toEqual([3])
    expect(answers.next().done).toBe(true)
})

test('int(x)', () => {
    const x = getVar()
    const answers = ask([x], int(x))

    expect(answers.next().value).toEqual([0])
    expect(answers.next().value).toEqual([1])
    expect(answers.next().value).toEqual([-1])
    expect(answers.next().value).toEqual([2])
    expect(answers.next().value).toEqual([-2])
    expect(answers.next().done).toBe(false)
})

test('member([1, 2, 3])', () => {
    const x = getVar()
    const answers = ask([x], member([1, 2, 3], x))

    expect(answers.next().value).toEqual([1])
    expect(answers.next().value).toEqual([2])
    expect(answers.next().value).toEqual([3])
    expect(answers.next().done).toBe(true)
})

test('[1, 2, 3].length = 3', () => {
    const x = getVar()
    const answers = ask([x], getMember([1, 2, 3], x, 'length'))

    expect(answers.next().value).toEqual([3])
    expect(answers.next().done).toBe(true)
})

test('[10, 20, 30][1] = 20', () => {
    const x = getVar()
    const answers = ask([x], getMember([10, 20, 30], x, 1))

    expect(answers.next().value).toEqual([20])
    expect(answers.next().done).toBe(true)
})

test('[1, 2, 3] * 2 = [2, 4, 6]', () => {
    const x = getVar()
    const answers = ask(
        [x],
        execMethod([1, 2, 3], x, 'map', el => el * 2)
    )

    expect(answers.next().value).toEqual([[2, 4, 6]])
    expect(answers.next().done).toBe(true)
})

test('[2, 3, 1].sort() = [1, 2, 3]', () => {
    const x = getVar()
    const answers = ask([x], execMethod([2, 3, 1], x, 'sort'))

    expect(answers.next().value).toEqual([[1, 2, 3]])
    expect(answers.next().done).toBe(true)
})

test('custom add func', () => {
    const x = getVar()
    const answers = ask(
        [x],
        execFunc(x, (a, b) => a + b, 5, 4)
    )

    expect(answers.next().value).toEqual([9])
    expect(answers.next().done).toBe(true)
})

test('tuple 3', () => {
    const x = getVar()
    const y = getVar()
    const z = getVar()
    const answers = ask([x, y, z], tuple(x, y, z))

    expect(answers.next().value).toEqual([0, 0, 0])
    expect(answers.next().value).toEqual([0, 0, 1])
    expect(answers.next().value).toEqual([0, 1, 0])
    expect(answers.next().value).toEqual([1, 0, 0])
    expect(answers.next().value).toEqual([0, 0, 2])
    expect(answers.next().value).toEqual([0, 1, 1])
    expect(answers.next().value).toEqual([0, 2, 0])
    expect(answers.next().value).toEqual([1, 0, 1])
    expect(answers.next().done).toBe(false)
})
