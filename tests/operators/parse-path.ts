import { assert } from 'chai'
import { parsePath, parsePoints } from '../../src/operators/parse-path'
import { renderPath } from '../../src/operators/render-path'

describe('parsePath()', () => {
    it('parses terms properly with spaces', () => {
        assert.deepEqual(parsePath('M 10 42')[0].d, [10, 42])
    })
    it('parses terms properly with commas', () => {
        assert.deepEqual(parsePath('M10,42')[0].d, [10, 42])
    })
    it('parses move (M | m)', () => {
        assert.deepEqual(parsePath('M 10 42')[0].d, [10, 42])
    })
    it('parses move (Z | z)', () => {
        assert.deepEqual(parsePath('M 10 42z')[0].d, [10, 42, 10, 42, 10, 42, 10, 42])
    })
    it('parses h', () => {
        assert.deepEqual(parsePath('M 10 50 h 50')[0].d, [10, 50, 10, 50, 10, 50, 60, 50])
    })
    it('parses H', () => {
        assert.deepEqual(parsePath('M 10 50 H 60')[0].d, [10, 50, 10, 50, 10, 50, 60, 50])
    })
    it('parses v', () => {
        assert.deepEqual(parsePath('M 50 10 v 50')[0].d, [50, 10, 50, 10, 50, 10, 50, 60])
    })
    it('parses V', () => {
        assert.deepEqual(parsePath('M 50 10 V 60')[0].d, [50, 10, 50, 10, 50, 10, 50, 60])
    })
    it('parses l', () => {
        assert.deepEqual(parsePath('M 10 10 l 10 10')[0].d, [10, 10, 10, 10, 10, 10, 20, 20])
    })
    it('parses L', () => {
        assert.deepEqual(parsePath('M 10 10 L 20 20')[0].d, [10, 10, 10, 10, 10, 10, 20, 20])
    })
    it('parses c', () => {
        assert.deepEqual(parsePath('M 10 10 c 10 5 5 10 25 25')[0].d, [10, 10, 20, 15, 15, 20, 35, 35])
    })
    it('parses C', () => {
        assert.deepEqual(parsePath('M 10 10 C 20 15 15 20 35 35')[0].d, [10, 10, 20, 15, 15, 20, 35, 35])
    })
    it('parses s', () => {
        assert.deepEqual(parsePath('M 10 10 s 50 35 55 85')[0].d, [10, 10, 10, 10, 60, 45, 65, 95])
    })
    it('parses s + s', () => {
        const actual = parsePath('M 10 10 s 10 40 25 25 s 10 40 25 25')[0].d
        assert.deepEqual(actual, [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60])
    })
    it('parses s with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 s 10 40 25 25 10 40 25 25')),
            'M 10 10 C 10 10 20 50 35 35 50 20 45 75 60 60'
        )
    })
    it('parses S', () => {
        assert.deepEqual(parsePath('M 10 10 S 20 15 35 35')[0].d, [10, 10, 10, 10, 20, 15, 35, 35])
    })
    it('parses S + S', () => {
        const actual = parsePath('M 10 10 S 20 50 35 35 S 45 75 60 60')[0].d
        assert.deepEqual(actual, [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60])
    })
    it('parses S with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 S 20 50 35 35 45 75 60 60')),
            'M 10 10 C 10 10 20 50 35 35 50 20 45 75 60 60'
        )
    })
    it('parses c followed by s', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 c10 10 10 40 25 25 s10 40 25 25')),
            'M 10 10 C 20 20 20 50 35 35 50 20 45 75 60 60'
        )
    })
    it('parses q', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 q 10 5 15 25')), 'M 10 10 C 16.67 13.33 21.67 21.67 25 35')
    })
    it('parses Q', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 Q 20 15 25 35')), 'M 10 10 C 16.67 13.33 21.67 21.67 25 35')
    })
    it('parses t', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 t 15 25')), 'M 10 10 C 10 10 10 10 25 35')
    })
    it('parses t + t', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 t 15 25 t 25 15')),
            'M 10 10 C 10 10 10 10 25 35 35 51.67 43.33 56.67 50 50'
        )
    })
    it('parses t with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 t 15 25 25 15')),
            'M 10 10 C 10 10 10 10 25 35 35 51.67 43.33 56.67 50 50'
        )
    })
    it('parses T', () => {
        assert.deepEqual(renderPath(parsePoints('M 10 10 T 25 35')), 'M 10 10 C 10 10 10 10 25 35')
    })
    it('parses T + T', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 T 25 35 T 70 50')),
            'M 10 10 C 10 10 10 10 25 35 35 51.67 50 56.67 70 50'
        )
    })
    it('parses T with multiple argument sets', () => {
        assert.deepEqual(
            renderPath(parsePoints('M 10 10 T 25 35 70 50')),
            'M 10 10 C 10 10 10 10 25 35 35 51.67 50 56.67 70 50'
        )
    })

    it('parsePaths a path and returns bounding information', () => {
        // prettier-ignore
        const expected = [
            {
                d: [20, 20, 20, 20, 20, 20, -10, 80, -10, 80, -10, 80, 20, 20],
                x: -10,
                y: 20,
                w: 30,
                h: 60
            }
        ]
        assert.deepEqual(parsePath('M20,20L-10,80z'), expected)
    })

    it('parsePaths multi-segment paths', () => {
        const actual = parsePath('M0,0 V12 H12 V0z M16,16 V20 H20 V16z')
        // prettier-ignore
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
