import { assert } from 'chai'
import { parsePath } from '../../src/operators/parsePath'
import { parsePoints } from '../../src/operators/parsePoints'
import { renderPath } from '../../src/operators/renderPath'

describe('parsePath()', () => {
    it('parses terms properly with spaces', () => {
        assert.deepEqual(parsePath('M 10 42 v 0').data[0].d, [10, 42, 10, 42, 10, 42, 10, 42])
    })
    it('ignores spaces, tabs, and new lines', () => {
      assert.deepEqual(parsePath('M10,42\n \tv0').data[0].d, [10, 42, 10, 42, 10, 42, 10, 42])
    });
    it('parses terms properly with commas', () => {
        assert.deepEqual(parsePath('M10,42v0').data[0].d, [10, 42, 10, 42, 10, 42, 10, 42])
    })
    it('parses move (M | m)', () => {
        assert.deepEqual(parsePath('M 10 42v0').data[0].d, [10, 42, 10, 42, 10, 42, 10, 42])
    })
    it('parses move (Z | z)', () => {
        assert.deepEqual(parsePath('M 10 42z').data[0].d, [10, 42, 10, 42, 10, 42, 10, 42])
    })
    it('parses h', () => {
        assert.deepEqual(parsePath('M 10 50 h 50').data[0].d, [10, 50, 10, 50, 10, 50, 60, 50])
    })
    it('parses H', () => {
        assert.deepEqual(parsePath('M 10 50 H 60').data[0].d, [10, 50, 10, 50, 10, 50, 60, 50])
    })
    it('parses v', () => {
        assert.deepEqual(parsePath('M 50 10 v 50').data[0].d, [50, 10, 50, 10, 50, 10, 50, 60])
    })
    it('parses V', () => {
        assert.deepEqual(parsePath('M 50 10 V 60').data[0].d, [50, 10, 50, 10, 50, 10, 50, 60])
    })
    it('parses l', () => {
        assert.deepEqual(parsePath('M 10 10 l 10 10').data[0].d, [10, 10, 10, 10, 10, 10, 20, 20])
    })
    it('parses L', () => {
        assert.deepEqual(parsePath('M 10 10 L 20 20').data[0].d, [10, 10, 10, 10, 10, 10, 20, 20])
    })
    it('parses c', () => {
        assert.deepEqual(parsePath('M 10 10 c 10 5 5 10 25 25').data[0].d, [10, 10, 20, 15, 15, 20, 35, 35])
    })
    it('parses C', () => {
        assert.deepEqual(parsePath('M 10 10 C 20 15 15 20 35 35').data[0].d, [10, 10, 20, 15, 15, 20, 35, 35])
    })
    it('parses s', () => {
        assert.deepEqual(parsePath('M 10 10 s 50 35 55 85').data[0].d, [10, 10, 10, 10, 60, 45, 65, 95])
    })
    it('parses s + s', () => {
        const actual = parsePath('M 10 10 s 10 40 25 25 s 10 40 25 25').data[0].d
        assert.deepEqual(actual, [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60])
    })
    it('parses s with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 s 10 40 25 25 10 40 25 25'), Math.round),
            'M 10 10 C 10 10 20 50 35 35 50 20 45 75 60 60'
        )
    })
    it('parses S', () => {
        assert.deepEqual(parsePath('M 10 10 S 20 15 35 35').data[0].d, [10, 10, 10, 10, 20, 15, 35, 35])
    })
    it('parses S + S', () => {
        const actual = parsePath('M 10 10 S 20 50 35 35 S 45 75 60 60').data[0].d
        assert.deepEqual(actual, [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60])
    })
    it('parses S with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 S 20 50 35 35 45 75 60 60'), Math.round),
            'M 10 10 C 10 10 20 50 35 35 50 20 45 75 60 60'
        )
    })
    it('parses c followed by s', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 c10 10 10 40 25 25 s10 40 25 25'), Math.round),
            'M 10 10 C 20 20 20 50 35 35 50 20 45 75 60 60'
        )
    })
    it('parses q', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 q 10 5 15 25'), Math.round), 'M 10 10 C 17 13 22 22 25 35')
    })
    it('parses Q', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 Q 20 15 25 35'), Math.round), 'M 10 10 C 17 13 22 22 25 35')
    })
    it('parses t', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 t 15 25'), Math.round), 'M 10 10 C 10 10 10 10 25 35')
    })
    it('parses t + t', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 t 15 25 t 25 15'), Math.round),
            'M 10 10 C 10 10 10 10 25 35 35 52 43 57 50 50'
        )
    })
    it('parses t with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 t 15 25 25 15'), Math.round),
            'M 10 10 C 10 10 10 10 25 35 35 52 43 57 50 50'
        )
    })
    it('parses T', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 T 25 35'), Math.round), 'M 10 10 C 10 10 10 10 25 35')
    })
    it('parses T + T', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 T 25 35 T 70 50'), Math.round),
            'M 10 10 C 10 10 10 10 25 35 35 52 50 57 70 50'
        )
    })
    it('parses T with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 T 25 35 70 50'), Math.round),
            'M 10 10 C 10 10 10 10 25 35 35 52 50 57 70 50'
        )
    })

    it('parsePaths a path and returns bounding information', () => {
        const original = 'M20,20L-10,80z'
        // prettier-ignore
        const expected = {
        path: original,
        data: [
          {
            d: [20, 20, 20, 20, 20, 20, -10, 80, -10, 80, -10, 80, 20, 20],
            x: -10,
            y: 20,
            w: 30,
            h: 60,
            p: 134
          }
        ]
      }
        assert.deepEqual(parsePath(original), expected)
    })

    it('parsePaths multi-segment paths', () => {
        const original = 'M0,0 V12 H12 V0z M16,16 V20 H20 V16z'
        const actual = parsePath(original)
        // prettier-ignore
        const expected = {
          path: original,
          data: [
            {
              d: [0, 0, 0, 0, 0, 0, 0, 12, 0, 12, 0, 12, 12, 12, 12, 12, 12, 12, 12, 0, 12, 0, 12, 0, 0, 0],
              x: 0,
              y: 0,
              w: 12,
              h: 12,
              p: 48
            },
            {

              d: [16, 16, 16, 16, 16, 16, 16, 20, 16, 20, 16, 20, 20, 20, 20, 20, 20, 20, 20, 16, 20, 16, 20, 16, 16, 16],
              x: 16,
              y: 16,
              w: 4,
              h: 4,
              p: 16
            }
          ]
        };
        assert.deepEqual(actual, expected)
    })
})
