import Domain from './domain.js'

test('properly makes domain [0, 100]', () => {
    const domain = new Domain(0, 100)

    expect(domain).toEqual({ min: 0, max: 100 })

    expect(domain.ifMember(0)).toBe(true)
    expect(domain.ifMember(100)).toBe(true)
    expect(domain.ifMember(50)).toBe(true)
    expect(domain.ifMember(200)).toBe(false)
    expect(domain.ifMember(-200)).toBe(false)

    expect(domain.isValid()).toBe(true)
})
test('properly makes domain [-100,100]', () => {
    const domain = new Domain(-100, 100)

    expect(domain).toEqual({ min: -100, max: 100 })

    expect(domain.ifMember(-100)).toBe(true)
    expect(domain.ifMember(100)).toBe(true)
    expect(domain.ifMember(0)).toBe(true)
    expect(domain.ifMember(200)).toBe(false)
    expect(domain.ifMember(-200)).toBe(false)

    expect(domain.isValid()).toBe(true)
})
test('properly makes domain [0.1, 40.4]', () => {
    const domain = new Domain(0.1, 40.4)

    expect(domain).toEqual({ min: 0.1, max: 40.4 })

    expect(domain.ifMember(0.1)).toBe(true)
    expect(domain.ifMember(40.4)).toBe(true)
    expect(domain.ifMember(5.1)).toBe(true)
    expect(domain.ifMember(200)).toBe(false)
    expect(domain.ifMember(-200)).toBe(false)

    expect(domain.isValid()).toBe(true)
})

test('makes domain [100, 10] not valid', () => {
    const domain = new Domain(100, 10)

    expect(domain.isValid()).toBe(false)
})

test('[0, 100] ∩ [50, 150] = [50, 100] ', () => {
    const domainA = new Domain(0, 100)
    const domainB = new Domain(50, 150)
    const domainC = new Domain(50, 100)

    expect(domainA.intersect(domainB)).toEqual(domainC)
})

test('[0, 10] ∩ [20, 100] = ∅', () => {
    const domainA = new Domain(0, 10)
    const domainB = new Domain(20, 100)

    expect(domainA.intersect(domainB).isValid()).toBe(false)
})

test('[-100, 10] + [-10, 100] = [-110, 110]', () => {
    const domainA = new Domain(-100, 10)
    const domainB = new Domain(-10, 100)
    const domainC = new Domain(-110, 110)

    expect(domainA.add(domainB)).toEqual(domainC)
})

test('[-100, 10] - [-10, 100] = [-200, 20]', () => {
    const domainA = new Domain(-100, 10)
    const domainB = new Domain(-10, 100)
    const domainC = new Domain(-200, 20)

    expect(domainA.sub(domainB)).toEqual(domainC)
})

test('[-100, 10] * [-10, 100] = [-1000, 1000]', () => {
    const domainA = new Domain(-100, 10)
    const domainB = new Domain(-10, 100)
    const domainC = new Domain(-10000, 1000)

    expect(domainA.mul(domainB)).toEqual(domainC)
})

test('[0, 10] / [4, 8] = [0, 5/2]', () => {
    const domainA = new Domain(0, 10)
    const domainB = new Domain(4, 8)

    const result = domainA.div(domainB)
    const expected = new Domain(0, 5 / 2)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[1, 10] / [-8, -4] = [-5/2, -0]', () => {
    const domainA = new Domain(0, 10)
    const domainB = new Domain(-8, -4)

    const result = domainA.div(domainB)
    const expected = new Domain(-5 / 2, -0)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[-10, 0] / [4, 8] = [-5/2, 0]', () => {
    const domainA = new Domain(-10, 0)
    const domainB = new Domain(4, 8)

    const result = domainA.div(domainB)
    const expected = new Domain(-5 / 2, 0)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[-10, 0] / [-8, -4] = [-0, 5/2]', () => {
    const domainA = new Domain(-10, 0)
    const domainB = new Domain(-8, -4)

    const result = domainA.div(domainB)
    const expected = new Domain(-0, 5 / 2)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[-1, 10] / [4, 8] = [-1/4, 5/2]', () => {
    const domainA = new Domain(-1, 10)
    const domainB = new Domain(4, 8)

    const result = domainA.div(domainB)
    const expected = new Domain(-1 / 4, 5 / 2)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[1, 10] / [0, 8] = [1/8, Infinity]', () => {
    const domainA = new Domain(1, 10)
    const domainB = new Domain(0, 8)

    const result = domainA.div(domainB)
    const expected = new Domain(1 / 8, Infinity)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[-10, -1] / [0, 8] = [-Infinity, -1/8]', () => {
    const domainA = new Domain(-10, -1)
    const domainB = new Domain(0, 8)

    const result = domainA.div(domainB)
    const expected = new Domain(-Infinity, -1 / 8)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[1, 10] / [-8, 0] = [-Infinity, -1/8]', () => {
    const domainA = new Domain(1, 10)
    const domainB = new Domain(-8, 0)

    const result = domainA.div(domainB)
    const expected = new Domain(-Infinity, -1 / 8)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[-10, -1] / [-8, 0] = [1/8, Infinity]', () => {
    const domainA = new Domain(-10, -1)
    const domainB = new Domain(-8, 0)

    const result = domainA.div(domainB)
    const expected = new Domain(1 / 8, Infinity)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[-1, 10] / [-4, 4] = [-Infinity, Infinity]', () => {
    const domainA = new Domain(-1, 10)
    const domainB = new Domain(-4, 4)

    const result = domainA.div(domainB)
    const expected = Domain.REAL

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[1, 10] / [-4, 8] = [[-Infinity, -1/4],[1/8, Infinity]]', () => {
    const domainA = new Domain(1, 10)
    const domainB = new Domain(-4, 8)
    const domainList = [
        new Domain(-Infinity, -1 / 4),
        new Domain(1 / 8, Infinity)
    ]

    expect(domainA.div(domainB)).toEqual(domainList)
})

test('[-10, -1] / [-4, 8] = [[-Infinity, -1/8],[1/4, Infinity]]', () => {
    const domainA = new Domain(-10, -1)
    const domainB = new Domain(-4, 8)
    const domainList = [
        new Domain(-Infinity, -1 / 8),
        new Domain(1 / 4, Infinity)
    ]

    expect(domainA.div(domainB)).toEqual(domainList)
})

test('[0, 0] / [-4, 4] = [0, 0]', () => {
    const domainA = new Domain(0, 0)
    const domainB = new Domain(-4, 4)

    const result = domainA.div(domainB)
    const expected = new Domain(0, 0)

    expect(result.length).toBe(1)
    expect(result[0]).toEqual(expected)
})

test('[-1, 10] / [0, 0] = ∅', () => {
    const domainA = new Domain(-1, 10)
    const domainB = new Domain(0, 0)

    const result = domainA.div(domainB)

    expect(result.length).toBe(0)
})
