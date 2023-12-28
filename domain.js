// TODO: better compar
export default class Domain {
    constructor(min, max) {
        this.min = min
        this.max = max
    }

    static REAL = new Domain(-Infinity, Infinity)

    ifMember(x) {
        return x >= this.min && x <= this.max
    }

    isValid() {
        return this.min <= this.max
    }

    intersect(other) {
        return new Domain(
            Math.max(this.min, other.min),
            Math.min(this.max, other.max)
        )
    }

    add(other) {
        return new Domain(this.min + other.min, this.max + other.max)
    }

    sub(other) {
        return new Domain(this.min - other.max, this.max - other.min)
    }

    mul(other) {
        const borderPoints = [
            this.min * other.min,
            this.min * other.max,
            this.max * other.min,
            this.max * other.max
        ]
        return new Domain(Math.min(...borderPoints), Math.max(...borderPoints))
    }

    div(other) {
        if (other.min === 0 && other.max === 0) return []

        if (this.min === 0 && this.max === 0) return [new Domain(0, 0)]

        if (other.min === -Infinity && other.max === Infinity)
            return [Domain.REAL]

        if (other.min < 0 && other.max > 0) {
            if (this.min > 0)
                return [
                    new Domain(-Infinity, this.min / other.min),
                    new Domain(this.min / other.max, Infinity)
                ]

            if (this.max < 0)
                return [
                    new Domain(-Infinity, this.max / other.max),
                    new Domain(this.max / other.min, Infinity)
                ]

            return [Domain.REAL]
        }

        if (other.min === 0 && this.min >= 0)
            return [new Domain(this.min / other.max, Infinity)]

        if (other.min === 0 && this.max <= 0)
            return [new Domain(-Infinity, this.max / other.max)]

        if (other.max === 0 && this.min >= 0)
            return [new Domain(-Infinity, this.min / other.min)]

        if (other.max === 0 && this.max <= 0)
            return [new Domain(this.max / other.min, Infinity)]

        const borderPoints = [
            this.min / other.min,
            this.min / other.max,
            this.max / other.min,
            this.max / other.max
        ]
        return [
            new Domain(Math.min(...borderPoints), Math.max(...borderPoints))
        ]
    }
}
