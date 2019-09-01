import { IRenderer, InterpolateOptions, FloatArray } from '../types'
import { renderPath } from './renderPath'
import { EPSILON, abs, floor, min } from '../utilities/math'
import { raiseError } from '../utilities/errors'
import { normalizePaths } from './normalizePaths'
import { fillObject } from '../utilities/objects'
import { createNumberArray } from '../utilities/createNumberArray'
import { FILL, _ } from '../constants'
import { Path } from '../path';

const defaultOptions: InterpolateOptions = {
    addPoints: 0,
    optimize: FILL,
    origin: { x: 0, y: 0 },
    precision: 0
}

/**
 * Returns a function to interpolate between the two path shapes.  polymorph.parse() must be called
 * before invoking this function.  In most cases, it is more appropriate to use polymorph.morph() instead of this.
 * @param leftPath path to interpolate
 * @param rightPath path to interpolate
 */
export function interpolatePath(paths: Path[], options: InterpolateOptions): (offset: number) => string {
    options = fillObject(options, defaultOptions)

    if (!paths || paths.length < 2) {
        raiseError('invalid arguments')
    }

    const hlen = paths.length - 1
    const items: IRenderer<FloatArray[] | string>[] = Array(hlen)
    for (let h = 0; h < hlen; h++) {
        items[h] = getPathInterpolator(paths[h], paths[h + 1], options)
    }

    // create formatter for the precision
    const formatter = !options.precision ? _ : (n: number) => n.toFixed(options.precision)

    return (offset: number): string => {
        const d = hlen * offset
        const flr = min(floor(d), hlen - 1)
        return renderPath(items[flr]((d - flr) / (flr + 1)), formatter)
    }
}

function getPathInterpolator(left: Path, right: Path, options: InterpolateOptions): IRenderer<FloatArray[] | string> {
    const matrix = normalizePaths(left.getData(), right.getData(), options)
    const n = matrix[0].length
    return (offset: number) => {
        if (abs(offset - 0) < EPSILON) {
            return left.getStringData()
        }
        if (abs(offset - 1) < EPSILON) {
            return right.getStringData()
        }

        const results: FloatArray[] = Array(n)
        for (let h = 0; h < n; h++) {
            results[h] = mixPoints(matrix[0][h], matrix[1][h], offset)
        }
        return results
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
