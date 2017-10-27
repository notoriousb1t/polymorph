import { assert } from 'chai'
import { isClockwise } from '../../src/operators/normalizePaths'
import { parsePath } from '../../src/operators/parsePath';

describe('isClockwise()', () => {
  it('returns true if the path is clockwise', () => {
    const shape = parsePath('M0,0H10V10H0z')
    assert.isTrue(isClockwise(shape.data[0]));
  })

  it('returns false if the path is counter-clockwise', () => {
    const shape = parsePath('M0,0V10H10V0z')
    assert.isFalse(isClockwise(shape.data[0]));
  })
});
