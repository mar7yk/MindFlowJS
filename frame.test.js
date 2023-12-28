import Frame from './frame.js'
import Binding from './binding.js'
import { getVar } from './logicVariable.js'

test('properly walk x in empty frame', () => {
    const x = getVar()
    const frame = new Frame()

    expect(frame.lookupBinding(x)).toBe(undefined)
    expect(frame.walk(x)).toBe(x)
})

test("properly walk frame x = 1; y = -1; z = 'word'", () => {
    const x = getVar()
    const y = getVar()
    const z = getVar()

    let frame = new Frame()
    frame = frame.extend(x, 1)
    frame = frame.extend(y, -1)
    frame = frame.extend(z, 'word')

    expect(frame.lookupBinding(x)).toEqual(new Binding(x, 1))
    expect(frame.walk(x)).toBe(1)
    expect(frame.lookupBinding(y)).toEqual(new Binding(x, -1))
    expect(frame.walk(y)).toBe(-1)
    expect(frame.lookupBinding(z)).toEqual(new Binding(x, 'word'))
    expect(frame.walk(z)).toBe('word')
})

test("properly walk frame x if x = y; y = z; z = 'word'", () => {
    const x = getVar()
    const y = getVar()
    const z = getVar()

    const frame = new Frame().extend(x, y).extend(y, z).extend(z, 'word')

    expect(frame.lookupBinding(x)).toEqual(new Binding(x, y))
    expect(frame.lookupBinding(y)).toEqual(new Binding(y, z))
    expect(frame.lookupBinding(z)).toEqual(new Binding(z, 'word'))
    expect(frame.walk(x)).toBe('word')
})
