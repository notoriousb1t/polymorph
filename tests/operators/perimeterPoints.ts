import * as assert from 'assert';
import { perimeterPoints } from '../../src/operators/perimeterPoints'
import { parsePoints } from '../../src/operators/parsePoints'

test('sums up the perimeter when going clockwise', () => {
    const points = parsePoints('M0,0 H20V20H0z')
    const clockwise = perimeterPoints(points[0])

    assert.equal(clockwise, 80)
})