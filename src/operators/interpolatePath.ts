import { IPath, IRenderer, InterpolateOptions } from '../types'
import { renderPath } from './renderPath'
import { EPSILON, abs, floor, min } from '../utilities/math'
import { raiseError } from '../utilities/errors'
import { normalizePaths } from './normalizePaths'
import { fillObject } from '../utilities/objects';

const defaultOptions: InterpolateOptions = {
  align: true,
  fillStrategy: 'insert',
  wind: 'clockwise'
}

/**
 * Returns a function to interpolate between the two path shapes.  polymorph.parse() must be called
 * before invoking this function.  In most cases, it is more appropriate to use polymorph.morph() instead of this.
 * @param leftPath path to interpolate
 * @param rightPath path to interpolate
 */
export function interpolatePath(paths: IPath[], options: InterpolateOptions): (offset: number) => string {
    options = fillObject(options, defaultOptions)

    if (!paths || paths.length < 2) {
        raiseError('invalid arguments')
    }

    const hlen = paths.length - 1
    const items: IRenderer<number[][] | string>[] = Array(hlen)
    for (let h = 0; h < hlen; h++) {
        items[h] = getPathInterpolator(paths[h], paths[h + 1], options)
    }

    return (offset: number): string => {
        const d = hlen * offset
        const flr = min(floor(d), hlen - 1)
        return renderPath(items[flr]((d - flr) / (flr + 1)))
    }
}

function getPathInterpolator(left: IPath, right: IPath, options: InterpolateOptions): IRenderer<number[][] | string> {
    const matrix = normalizePaths(left, right, options)
    const n = matrix[0].length
    return (offset: number) => {
        if (abs(offset - 0) < EPSILON) {
            return left.path
        }
        if (abs(offset - 1) < EPSILON) {
            return right.path
        }

        const results: number[][] = Array(n)
        for (let h = 0; h < n; h++) {
            results[h] = mixPoints(matrix[0][h], matrix[1][h], offset)
        }
        return results
    }
}

export function mixPoints(a: number[], b: number[], o: number): number[] {
    const alen = a.length
    const results: number[] = Array(alen)
    for (let i = 0; i < alen; i++) {
        results[i] = a[i] + (b[i] - a[i]) * o
    }
    return results
}
