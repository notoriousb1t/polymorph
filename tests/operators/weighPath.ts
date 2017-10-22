import { assert } from 'chai'
import { weighPath } from '../../src/operators/weighPath'

describe('weighPath()', () => {
  it('properly scores two number sets', () => {
    const weight = weighPath([-2, 3, -2], [0, 1, 2])
    assert.equal(weight, 24)
  })
})
