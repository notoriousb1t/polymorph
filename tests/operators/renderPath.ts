import { assert } from 'chai'
import { renderPath } from '../../src/operators/renderPath'

describe('renderPath()', () => {
    it('renders a segment properly', () => {
        // prettier-ignore
        const start = [[
            0, 10,
            20, 20, 40, 40, 50, 50
        ]]
        assert.equal(renderPath(start, Math.round), 'M 0 10 C 20 20 40 40 50 50')
    })
})
