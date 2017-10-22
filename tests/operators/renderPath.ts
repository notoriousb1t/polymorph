import { assert } from 'chai'
import { renderPath } from '../../src/operators/renderPath'

describe('renderPath()', () => {
  it('renders a segment properly', () => {
    assert.equal(renderPath([[0, 10, 20, 40, 50]]), 'M 0 10 C 20 40 50')
  })
});
