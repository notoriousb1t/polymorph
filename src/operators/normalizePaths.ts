import { IPathSegment, IPath, InterpolateOptions, FloatArray, Matrix } from '../types'
import { fillSegments } from './fillSegments'
import { normalizePoints } from './normalizePoints'
import { fillPoints } from './fillPoints'
import { FILL, NONE } from '../constants'
import { raiseError } from '../utilities/errors'

function sizeDesc(a: IPathSegment, b: IPathSegment): number {
    return b.p - a.p
}

export function normalizePaths(left: IPath, right: IPath, options: InterpolateOptions): FloatArray[][] {
    // sort segments by perimeter size (more or less area)
    const leftPath = getSortedSegments(left)
    const rightPath = getSortedSegments(right)
    const origin = options.origin
    const ox = origin.x
    const oy = origin.y
    const absolute = origin.absolute

    if (leftPath.length !== rightPath.length) {
        if (options.optimize === FILL) {
            // ensure there are an equal amount of segments
            fillSegments(leftPath, rightPath, options.origin)
        } else {
            raiseError('optimize:none requires equal lengths')
        }
    }

    const matrix = Array(2) as Matrix
    matrix[0] = leftPath.map(toPoints)
    matrix[1] = rightPath.map(toPoints)

    if (options.optimize !== NONE) {
        // shift so both svg's are being drawn from relatively the same place
        for (let i = 0; i < leftPath.length; i++) {
            const ls = leftPath[i]
            const rs = rightPath[i]

            normalizePoints(absolute ? ox : ls.x + ls.w * ox, absolute ? oy : ls.y + ls.h * oy, matrix[0][i])
            normalizePoints(absolute ? ox : rs.x + rs.w * ox, absolute ? oy : rs.y + rs.h * oy, matrix[1][i])
        }
    }

    if (options.optimize === FILL) {
        fillPoints(matrix, options.addPoints * 6)
    }
    return matrix
}

function getSortedSegments(path: IPath): IPathSegment[] {
    return path.data.slice().sort(sizeDesc)
}

function toPoints(p: IPathSegment): FloatArray {
    return p.d
}
