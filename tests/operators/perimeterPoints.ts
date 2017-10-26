import { assert } from 'chai'
import { perimeterPoints } from '../../src/operators/perimeterPoints'
import { parsePoints } from '../../src/operators/parsePoints'
import { reversePoints } from '../../src/operators/reversePoints'

describe('perimeter()', () => {
    it('sums up the perimeter when going clockwise', () => {
        const points = parsePoints('M0,0 H20V20H0z')
        const clockwise = perimeterPoints(points[0])

        assert.equal(clockwise, 80)
    })
    it('sums up the perimeter when going counter-clockwise', () => {
        const points = parsePoints('M0,0 H20V20H0z')
        const counterClockwise = perimeterPoints(reversePoints(points[0]))

        assert.equal(counterClockwise, 80)
    })
})
