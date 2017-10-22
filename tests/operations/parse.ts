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

    it('parses multi-segment paths', () => {
        const actual = parse('M0,0 V12 H12 V0z M16,16 V20 H20 V16z')
        const expected = [
          {
            d: [0, 0, 0, 0, 0, 0, 0, 12, 0, 12, 0, 12, 12, 12, 12, 12, 12, 12, 12, 0, 12, 0, 12, 0, 0, 0],
            x: 0,
            y: 0,
            w: 12,
            h: 12
          },
          {
            d: [16, 16, 16, 16, 16, 16, 16, 20, 16, 20, 16, 20, 20, 20, 20, 20, 20, 20, 20, 16, 20, 16, 20, 16, 16, 16],
            x: 16,
            y: 16,
            w: 4,
            h: 4
          }
        ];
        assert.deepEqual(actual, expected)
    })
})
