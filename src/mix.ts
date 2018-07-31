import { IMixOptions, FloatArray } from './types'
import { renderPath } from './operators/renderPath'
import { EPSILON, abs, round } from './utilities/math' 
import { normalizePaths } from './operators/normalizePaths'
import { fillObject } from './utilities/objects'
import { createNumberArray } from './utilities/createNumberArray'
import { FILL } from './constants'
import { parsePath } from './operators/parsePath';
import { getPath } from './getPath';

const defaultOptions = {
  optimize: FILL,
  origin: { x: 0, y: 0 },
  precision: 0
} as IMixOptions;

/**
 * Returns a function to interpolate between the two path shapes.
 * @param left path data, CSS selector, or path element
 * @param right path data, CSS selector, or path element
 */
export function mix(options?: IMixOptions): (offset: number) => string {
  options = fillObject(options, defaultOptions)

  const left = parsePath(getPath(options.fromPath));
  const right = parsePath(getPath(options.toPath));

  const formatter = !options.precision ? round : (n: number) => n.toFixed(options.precision)
  const matrix = normalizePaths(left, right, options)
  const n = matrix[0].length

  return (offset: number) => {
      if (abs(offset - 0) < EPSILON) {
          return left.path
      }
      if (abs(offset - 1) < EPSILON) {
          return right.path
      }

      const results: FloatArray[] = Array(n)
      for (let h = 0; h < n; h++) {
          results[h] = mixPoints(matrix[0][h], matrix[1][h], offset)
      }
      return renderPath(results, formatter)
  }
}

export function mixPoints(a: FloatArray, b: FloatArray, o: number): FloatArray {
  const alen = a.length
  const results = createNumberArray(alen)
  for (let i = 0; i < alen; i++) {
      results[i] = a[i] + (b[i] - a[i]) * o
  }
  return results
}
