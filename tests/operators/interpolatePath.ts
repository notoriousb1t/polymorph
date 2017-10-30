import { assert } from 'chai'
import { mixPoints } from '../../src/operators/interpolatePath'

describe('mixPoints()', () => {
    it('finds the midpoint when .25 is provided', () => {
        assert.deepEqual(mixPoints([0, 0, 0], [10, 100, 1000], 0.25), Float32Array.from([2.5, 25, 250]))
    })
    it('finds the midpoint when .5 is provided', () => {
        assert.deepEqual(mixPoints([0, 0, 0], [10, 100, 1000], 0.5), Float32Array.from([5, 50, 500]))
    })
    it('finds the midpoint when .75 is provided', () => {
        assert.deepEqual(mixPoints([0, 0, 0], [10, 100, 1000], 0.75), Float32Array.from([7.5, 75, 750]))
    })
})
