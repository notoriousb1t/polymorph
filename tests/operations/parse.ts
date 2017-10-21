import { assert } from 'chai'
import { parse } from '../../src/operations/parse'

describe('parse()', () => {
    it('parses a path and returns bounding information', () => {
        assert.deepEqual(parse('M20,20L-10,80z'), [
            {
                d: [20, 20, 20, 20, 20, 20, -10, 80, -10, 80, -10, 80, 20, 20],
                x: -10,
                y: 20,
                w: 30,
                h: 60
            }
        ])
    })
})
