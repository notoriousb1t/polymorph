import { InterpolateOptions, FloatArray, Matrix } from '../types'
import { fillSegments } from './fillSegments'
import { normalizePoints } from './normalizePoints'
import { fillPoints } from './fillPoints'
import { FILL } from '../constants'
import { raiseError } from '../utilities/errors'
import { getSortedSegments } from './getSortedSegments';

export function normalizePaths(left: FloatArray[], right: FloatArray[], options: InterpolateOptions): FloatArray[][] {
    // sort segments by perimeter size (more or less area)
    if (options.optimize === FILL) {
        left = getSortedSegments(left);
        right = getSortedSegments(right);
    }

    if (left.length !== right.length) {
        if (options.optimize === FILL) {
            // ensure there are an equal amount of segments
            fillSegments(left, right, options.origin)
        } else {
            raiseError('optimize:none requires equal lengths')
        }
    }

    const matrix = Array(2) as Matrix
    matrix[0] = left
    matrix[1] = right

    if (options.optimize === FILL) {
        const {x, y, absolute} = options.origin;
        // shift so both svg's are being drawn from relatively the same place
        for (let i = 0; i < left.length; i++) {
            normalizePoints(absolute, x, y, matrix[0][i])
            normalizePoints(absolute, x, y, matrix[1][i])
        }
        fillPoints(matrix, options.addPoints * 6)
    }
    return matrix
}
