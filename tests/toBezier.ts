import { assert } from 'chai'
import { toBezier } from '../src/toBezier'

describe('toBezier()', () => {
  it('converts an absolute cubic bezier to itself', () => {
    assert.equal(toBezier('M 0 10 C 20 40 50 10 10 10'), 'M 0 10 C 20 40 50 10 10 10')
  })
});
