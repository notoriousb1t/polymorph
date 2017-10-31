import { assert } from 'chai'
import { parsePath } from '../../src/operators/parsePath';
import { fillSegments } from '../../src/operators/fillSegments';

describe('fillSegments()', () => {
  it('fills segments from the right', () => {
    const left = parsePath('M0,0 V12 H12 V0z M16,16 V20 H20 V16z');
    const right = parsePath('M0,0 V12 H12 V0z');

    fillSegments(left.data, right.data, { x: 0, y: 0 });

    assert.equal(left.data.length, right.data.length);
  })
  it('fills segments from the left', () => {
    const right = parsePath('M0,0 V12 H12 V0z M16,16 V20 H20 V16z');
    const left = parsePath('M0,0 V12 H12 V0z');

    fillSegments(left.data, right.data, { x: 0, y: 0 });

    assert.equal(left.data.length, right.data.length);
  })
})
