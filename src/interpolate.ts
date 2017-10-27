import { interpolatePath } from './operators/interpolatePath'
import { parse } from './parse'
import { IPathElement, InterpolateOptions } from './types'

/**
 * Returns a function to interpolate between the two path shapes.
 * @param left path data, CSS selector, or path element
 * @param right path data, CSS selector, or path element
 */
export function interpolate(paths: (string | IPathElement)[], options?: InterpolateOptions): (offset: number) => string {
  return interpolatePath(paths.map(parse), options || {})
}
