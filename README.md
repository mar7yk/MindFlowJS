MindFlowJS
=======

MindFlowJS adds logic programming to JavaScript.

Installation
=======

```sh
npm install mind-flow-js
```

getVar
=======
returns logical variable

ask
=======
returns a generator of answers

```javascript
import {ask, getVar, equal, or} from 'mind-flow-js'

const name = getVar()
const people = (name) => {
    return or(
        equal(name, 'James'),
        equal(name, 'Robert'),
        equal(name, 'John')
    )
}

console.log(...ask([name], people(name)))
// [ 'James' ] [ 'Robert' ] [ 'John' ]
```

check
=======
check if there is answer

```javascript
import {check, equal, or} from 'mind-flow-js'

const people = (name) => {
    return or(
        equal(name, 'James'),
        equal(name, 'Robert'),
        equal(name, 'John')
    )
}

console.log(check(people('James')))
// true

console.log(check(people('Michael')))
// false
```

custom recursion function example
=======

```javascript
import {ask, equal, getVar, sub, mul, and, oneOf, lessOrEqual} from 'mind-flow-js'

const x = getVar()

const fact = (x, result) => {
    const x1 = getVar()
    const result1 = getVar()
    return () => 
      oneOf(
          and(
              lessOrEqual(x, 1),
              equal(result, 1)
          ),
          and(
              sub(x, 1, x1),
              fact(x1, result1),
              mul(x, result1, result)
          )
      )()
    
}

console.log(...ask([x], fact(10, x)))
// [ 3628800 ]
```

add
=======

```javascript
import {ask, getVar, add} from 'mind-flow-js'

const x = getVar()

const toSolve = add(2, 3, x)

console.log(...ask([x], toSolve))
// [ 5 ]
```

and
=======

```javascript
import {ask, getVar, and, equal} from 'mind-flow-js'

const x = getVar()
const y = getVar()
const z = getVar()

const toSolve = and(equal(x, y), equal(y, z), equal(z, 5))

console.log(...ask([x, y, z], toSolve))
// [ 5, 5, 5 ]
```

between
=======

```javascript
import {ask, getVar, between} from 'mind-flow-js'

const x = getVar()

const toSolve = between(1, 4, x)

console.log(...ask([x], toSolve))
// [ 1 ] [ 2 ] [ 3 ] [ 4 ]
```

div
=======

```javascript
import {ask, getVar, div} from 'mind-flow-js'

const x = getVar()

const toSolve = div(5, 2, x)

console.log(...ask([x], toSolve))
// [ 2.5 ]
```

equal
=======

```javascript
import {ask, getVar, equal} from 'mind-flow-js'

const x = getVar()

const toSolve = equal(x, 5)

console.log(...ask([x], toSolve))
// [ 5 ]
```

execFunc
=======

```javascript
import {ask, getVar, execFunc} from 'mind-flow-js'

const x = getVar()

const toSolve = execFunc(x, (a, b) => a + b, 5, 4)

console.log(...ask([x], toSolve))
// [ 9 ]
```

execMethod
=======

```javascript
import {ask, getVar, execMethod} from 'mind-flow-js'

const x = getVar()

const toSolve = execMethod([1, 2, 3], x, 'map', el => el * 2)

console.log(...ask([x], toSolve))
// [ [ 2, 4, 6 ] ]
```

getMember
=======

```javascript
import {ask, getVar, getMember} from 'mind-flow-js'

const x = getVar()

const toSolve = getMember([1, 2, 3], x, 'length')

console.log(...ask([x], toSolve))
// [ 3 ]
```

getMember
=======

```javascript
import {ask, getVar, getMember} from 'mind-flow-js'

const x = getVar()

const toSolve = getMember([1, 2, 3], x, 'length')

console.log(...ask([x], toSolve))
// [ 3 ]
```

greater
=======

```javascript
import {check, greater} from 'mind-flow-js'

console.log(check(greater(1, 5)))
// false
console.log(check(greater(7, 3)))
// true
```

greaterOrEqual
=======

```javascript
import {check, greaterOrEqual} from 'mind-flow-js'

console.log(check(greaterOrEqual(5, 5)))
// true
console.log(check(greaterOrEqual(3, 5)))
// false
```

int
=======

```javascript
import {ask, getVar, int} from 'mind-flow-js'

const x = getVar()

const toSolve = int(x)

console.log(...ask([x], toSolve, 5))
// [ 0 ] [ 1 ] [ -1 ] [ 2 ] [ -2 ]
```

less
=======

```javascript
import {check, less} from 'mind-flow-js'

console.log(check(less(5, 1)))
// false
console.log(check(greater(3, 7)))
// true
```

lessOrEqual
=======

```javascript
import {check, lessOrEqual} from 'mind-flow-js'

console.log(check(lessOrEqual(5, 5)))
// true
console.log(check(lessOrEqual(5, 3)))
// false
```

member
=======

```javascript
import {ask, getVar, member} from 'mind-flow-js'

const x = getVar()

const toSolve = member([1, 2, 3], x)

console.log(...ask([x], toSolve))
// [ 1 ] [ 2 ] [ 3 ]
```

mod
=======

```javascript
import {ask, getVar, mod} from 'mind-flow-js'

const x = getVar()

const toSolve = mod(25, 7, x)

console.log(...ask([x], toSolve))
// [ 4 ]
```

mul
=======

```javascript
import {ask, getVar, mul} from 'mind-flow-js'

const x = getVar()

const toSolve = mul(4, 8, x)

console.log(...ask([x], toSolve))
// [ 32 ]
```

int
=======

```javascript
import {ask, getVar, nat} from 'mind-flow-js'

const x = getVar()

const toSolve = nat(x)

console.log(...ask([x], toSolve, 5))
// [ 0 ] [ 1 ] [ 2 ] [ 3 ] [ 4 ]
```

not
=======

```javascript
import {ask, getVar, not, equal, and, or} from 'mind-flow-js'

const x = getVar()

const toSolve = and(
    or(equal(x, 1), equal(x, 2)),
    not(equal(x, 1))
)

console.log(...ask([x], toSolve))
// [ 2 ]
```

notEqual
=======

```javascript
import {ask, getVar, notEqual, equal, and, or} from 'mind-flow-js'

const x = getVar()

const toSolve = and(
    or(equal(x, 1), equal(x, 2)),
    notEqual(x, 1)
)

console.log(...ask([x], toSolve))
// [ 2 ]
```

num
=======

```javascript
import {ask, getVar, nat} from 'mind-flow-js'

const x = getVar()

const toSolve = num(x)

console.log(...ask([x], toSolve, 5))
// [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]
```

oneOf
=======

```javascript
import {ask, getVar, oneOf, equal, and, greaterOrEqual} from 'mind-flow-js'

const x = getVar()

const toSolve = oneOf(
    and(greaterOrEqual(1, 2), equal(x, 1)),
    and(greaterOrEqual(2, 2), equal(x, 2)),
    and(greaterOrEqual(3, 2), equal(x, 3)),
)

console.log(...ask([x], toSolve))
// [ 2 ]
```

or
=======

```javascript
import {ask, getVar, or, equal, and, greaterOrEqual} from 'mind-flow-js'

const x = getVar()

const toSolve = or(
    and(greaterOrEqual(1, 2), equal(x, 1)),
    and(greaterOrEqual(2, 2), equal(x, 2)),
    and(greaterOrEqual(3, 2), equal(x, 3)),
)

console.log(...ask([x], toSolve))
// [ 2 ] [ 3 ]
```

add
=======

```javascript
import {ask, getVar, sub} from 'mind-flow-js'

const x = getVar()

const toSolve = sub(2, 3, x)

console.log(...ask([x], toSolve))
// [ -1 ]
```

tuple
=======

```javascript
import {ask, getVar, tuple} from 'mind-flow-js'

const x = getVar()
const y = getVar()
const z = getVar()

const toSolve = tuple(x, y, z)

console.log(...ask([x, y, z], toSolve, 10))
// [ 0, 0, 0 ] [ 0, 0, 1 ] [ 0, 1, 0 ] [ 1, 0, 0 ] [ 0, 0, 2 ]
// [ 0, 1, 1 ] [ 0, 2, 0 ] [ 1, 0, 1 ] [ 1, 1, 0 ] [ 2, 0, 0 ]
```
