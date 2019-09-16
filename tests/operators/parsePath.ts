import * as assert from 'assert';
import { Path } from '../../src/path'
import { parsePoints } from '../../src/operators/parsePoints'
import { renderPath } from '../../src/operators/renderPath'

test('parses terms properly with spaces', () => {
    assert.deepEqual(new Path('M 10 42 v 0').getData()[0], [10, 42, 10, 42, 10, 42, 10, 42])
})
test('ignores spaces, tabs, and new lines', () => {
    assert.deepEqual(new Path('M10,42\n \tv0').getData()[0], [10, 42, 10, 42, 10, 42, 10, 42])
})
test('parses terms properly with commas', () => {
    assert.deepEqual(new Path('M10,42v0').getData()[0], [10, 42, 10, 42, 10, 42, 10, 42])
})
test('parses move (M | m)', () => {
    assert.deepEqual(new Path('M 10 42v0').getData()[0], [10, 42, 10, 42, 10, 42, 10, 42])
})
test('parses move (Z | z)', () => {
    assert.deepEqual(new Path('M 10 42z').getData()[0], [10, 42, 10, 42, 10, 42, 10, 42])
})
test('parses h', () => {
    assert.deepEqual(new Path('M 10 50 h 50').getData()[0], [10, 50, 10, 50, 10, 50, 60, 50])
})
test('parses H', () => {
    assert.deepEqual(new Path('M 10 50 H 60').getData()[0], [10, 50, 10, 50, 10, 50, 60, 50])
})
test('parses v', () => {
    assert.deepEqual(new Path('M 50 10 v 50').getData()[0], [50, 10, 50, 10, 50, 10, 50, 60])
})
test('parses V', () => {
    assert.deepEqual(new Path('M 50 10 V 60').getData()[0], [50, 10, 50, 10, 50, 10, 50, 60])
})
test('parses l', () => {
    assert.deepEqual(new Path('M 10 10 l 10 10').getData()[0], [10, 10, 10, 10, 10, 10, 20, 20])
})
test('parses L', () => {
    assert.deepEqual(new Path('M 10 10 L 20 20').getData()[0], [10, 10, 10, 10, 10, 10, 20, 20])
})
test('parses c', () => {
    assert.deepEqual(new Path('M 10 10 c 10 5 5 10 25 25').getData()[0], [10, 10, 20, 15, 15, 20, 35, 35])
})
test('parses C', () => {
    assert.deepEqual(new Path('M 10 10 C 20 15 15 20 35 35').getData()[0], [10, 10, 20, 15, 15, 20, 35, 35])
})
test('parses s', () => {
    assert.deepEqual(new Path('M 10 10 s 50 35 55 85').getData()[0], [10, 10, 10, 10, 60, 45, 65, 95])
})
test('parses s + s', () => {
    const actual = new Path('M 10 10 s 10 40 25 25 s 10 40 25 25').getData()[0]
    assert.deepEqual(actual, [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60])
})
test('parses s with multiple argument sets', () => {
    assert.deepEqual(
        renderPath(parsePoints('M 10 10 s 10 40 25 25 10 40 25 25'), Math.round),
        'M 10 10 C 10 10 20 50 35 35 50 20 45 75 60 60'
    )
})
test('parses S', () => {
    assert.deepEqual(new Path('M 10 10 S 20 15 35 35').getData()[0], [10, 10, 10, 10, 20, 15, 35, 35])
})
test('parses S + S', () => {
    const actual = new Path('M 10 10 S 20 50 35 35 S 45 75 60 60').getData()[0]
    assert.deepEqual(actual, [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60])
})
test('parses S with multiple argument sets', () => {
    assert.deepEqual(
        renderPath(parsePoints('M 10 10 S 20 50 35 35 45 75 60 60'), Math.round),
        'M 10 10 C 10 10 20 50 35 35 50 20 45 75 60 60'
    )
})
test('parses c followed by s', () => {
    assert.deepEqual(
        renderPath(parsePoints('M 10 10 c10 10 10 40 25 25 s10 40 25 25'), Math.round),
        'M 10 10 C 20 20 20 50 35 35 50 20 45 75 60 60'
    )
})
test('parses q', () => {
    assert.deepEqual(renderPath(parsePoints('M 10 10 q 10 5 15 25'), Math.round), 'M 10 10 C 17 13 22 22 25 35')
})
test('parses Q', () => {
    assert.deepEqual(renderPath(parsePoints('M 10 10 Q 20 15 25 35'), Math.round), 'M 10 10 C 17 13 22 22 25 35')
})
test('parses t', () => {
    assert.deepEqual(renderPath(parsePoints('M 10 10 t 15 25'), Math.round), 'M 10 10 C 10 10 10 10 25 35')
})
test('parses t + t', () => {
    assert.deepEqual(
        renderPath(parsePoints('M 10 10 t 15 25 t 25 15'), Math.round),
        'M 10 10 C 10 10 10 10 25 35 35 52 43 57 50 50'
    )
})
test('parses t with multiple argument sets', () => {
    assert.deepEqual(
        renderPath(parsePoints('M 10 10 t 15 25 25 15'), Math.round),
        'M 10 10 C 10 10 10 10 25 35 35 52 43 57 50 50'
    )
})
test('parses T', () => {
    assert.deepEqual(renderPath(parsePoints('M 10 10 T 25 35'), Math.round), 'M 10 10 C 10 10 10 10 25 35')
})
test('parses T + T', () => {
    assert.deepEqual(
        renderPath(parsePoints('M 10 10 T 25 35 T 70 50'), Math.round),
        'M 10 10 C 10 10 10 10 25 35 35 52 50 57 70 50'
    )
})
test('parses T with multiple argument sets', () => {
    assert.deepEqual(
        renderPath(parsePoints('M 10 10 T 25 35 70 50'), Math.round),
        'M 10 10 C 10 10 10 10 25 35 35 52 50 57 70 50'
    )
})

test('parsePaths multi-segment paths', () => {
    const original = 'M0,0 V12 H12 V0z M16,16 V20 H20 V16z'
    const actual = new Path(original)
    // prettier-ignore
    const expected = [
        [0, 0, 0, 0, 0, 0, 0, 12, 0, 12, 0, 12, 12, 12, 12, 12, 12, 12, 12, 0, 12, 0, 12, 0, 0, 0],
        [16, 16, 16, 16, 16, 16, 16, 20, 16, 20, 16, 20, 20, 20, 20, 20, 20, 20, 20, 16, 20, 16, 20, 16, 16, 16]];
    assert.deepEqual(actual.getData(), expected)
})

test('parses a', () => {
    const actual = renderPath(parsePoints('M25 25 a20 20 30 0 0 50 50'), Math.round)
    assert.deepEqual(actual, 'M 25 25 C 6 44 15 77 41 84 53 87 66 84 75 75')
})
test('parses a with sweep flag', () => {
    const actual = renderPath(parsePoints('M25 25 a20 20 30 0 1 50 50'), Math.round)
    assert.deepEqual(actual, 'M 25 25 C 44 6 77 15 84 41 87 53 84 66 75 75')
})
test('parses a with large flag', () => {
    const actual = renderPath(parsePoints('M0,0 a20 5 90 1 0 100 0'), Math.round)
    assert.deepEqual(actual, 'M 0 0 C 0 154 42 250 75 173 90 137 100 71 100 0')
})
test('parses a with multiple arcs', () => {
    const actual = renderPath(
        parsePoints('M20,20 a10 10 45 1 0 0 25 10 10 45 1 0 0 25 10 10 45 1 0 0 25'),
        Math.round
    )
    assert.deepEqual(
        actual,
        'M 20 20 C 10 20 4 30 9 39 11 43 16 45 20 45 10 45 4 55 9 64 11 68 16 70 20 70 10 70 4 80 9 89 11 93 16 95 20 95'
    )
})
test('parses A', () => {
    const actual = renderPath(parsePoints('M25 25 A20 20 30 0 0 50 50'), Math.round)
    assert.deepEqual(actual, 'M 25 25 C 20 40 34 54 49 50 49 50 50 50 50 50')
})
test('parses A with sweep flag', () => {
    const actual = renderPath(parsePoints('M25 25 A20 20 30 0 1 50 50'), Math.round)
    assert.deepEqual(actual, 'M 25 25 C 40 20 54 34 50 49 50 49 50 50 50 50')
})
test('parses A with large flag', () => {
    const actual = renderPath(parsePoints('M25 25 A20 5 90 1 0 50 50'), Math.round)
    assert.deepEqual(actual, 'M 25 25 C 23 63 32 98 41 87 45 82 49 68 50 50')
})
