import { interpolatePath } from './operators/interpolatePath'
import { IMorphable, InterpolateOptions } from './types'
import { Path } from './path';

/**
 * Returns a function to interpolate between the two path shapes.
 * @param left path data, CSS selector, or path element
 * @param right path data, CSS selector, or path element
 */
export function interpolate(paths: IMorphable[], options?: InterpolateOptions): (offset: number) => string {
  return interpolatePath(
    paths.map((path: IMorphable) => new Path(path)), options || {})
}
