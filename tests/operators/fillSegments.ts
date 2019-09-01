import * as assert from 'assert';
import { Path } from '../../src/path';
import { fillSegments } from '../../src/operators/fillSegments';


test('fills segments from the right', () => {
  const left = new Path('M0,0 V12 H12 V0z M16,16 V20 H20 V16z');
  const right = new Path('M0,0 V12 H12 V0z');

  fillSegments(left.getData(), right.getData(), { x: 0, y: 0 });

  assert.equal(left.getData().length, right.getData().length);
})

test('fills segments from the left', () => {
  const right = new Path('M0,0 V12 H12 V0z M16,16 V20 H20 V16z');
  const left = new Path('M0,0 V12 H12 V0z');

  fillSegments(left.getData(), right.getData(), { x: 0, y: 0 });

  assert.equal(left.getData().length, right.getData().length);
})
