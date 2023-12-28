import List from './list.js'

export default class ListTester {
    static type = 'list'

    static get123() {
        return new List(1, new List(2, new List(3)))
    }

    static get456() {
        return new List(4, new List(5, new List(6)))
    }

    static checkList(list, expectedValues) {
        while (!list.isEmpty()) {
            expect(list.type).toBe(this.type)
            expect(list.first).toBe(expectedValues.shift())
            // eslint-disable-next-line no-param-reassign
            list = list.rest
        }
        expect(expectedValues.length).toBe(0)
    }

    static runTests() {
        test('properly makes list [1, 2, 3]', () => {
            const list = this.get123()
            const expectedValues = [1, 2, 3]

            this.checkList(list, expectedValues)
        })

        test('foreach [1, 2, 3]', () => {
            const list = this.get123()
            const set = new Set()

            list.foreach(el => {
                expect(list.type).toBe(this.type)
                set.add(el)
            })

            expect(set).toEqual(new Set([1, 2, 3]))
        })

        test('map [1, 2, 3] * 2', () => {
            let list = this.get123()
            list = list.map(el => el * 2)

            const expectedValues = [2, 4, 6]

            this.checkList(list, expectedValues)
        })

        test('append [4, 5, 6] to [1, 2, 3]', () => {
            const list1 = this.get123()
            const list2 = this.get456()
            const resultList = list1.append(list2)

            const expectedValues = [1, 2, 3, 4, 5, 6]

            this.checkList(resultList, expectedValues)
        })

        test('extend [1, 2, 3] with 4', () => {
            let list = this.get123()
            list = list.extend(4)

            const expectedValues = [4, 1, 2, 3]

            this.checkList(list, expectedValues)
        })
    }
}

ListTester.runTests()
