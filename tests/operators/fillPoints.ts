import * as assert from 'assert';
import { fillSubpath } from '../../src/operators/fillPoints'

test('it returns the same path if the same length is set', () => {
  // prettier-ignore
  const start = [
    10, 10,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
  ]
  const actual = fillSubpath(start, 20)

  assert.equal(20, actual.length)

  // prettier-ignore
  assert.deepEqual(actual, Float32Array.from([
    10, 10,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
  ]))
})

test('it fills the path as possible when a new set is available', () => {
  // prettier-ignore
  const start = [
    10, 10,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
  ]
  const actual = fillSubpath(start, 26)

  assert.equal(26, actual.length)

  // prettier-ignore
  assert.deepEqual(actual, Float32Array.from([
    10, 10,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
  ]))
})

test('it fills the path evenly if there are twice as many elements', () => {
  // prettier-ignore
  const start = [
    10, 10,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
  ]
  const actual = fillSubpath(start, 38)
  // prettier-ignore
  const expected = Float32Array.from([
    10, 10,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
  ])

  assert.equal(38, actual.length)
  assert.deepEqual(actual, expected)
})
