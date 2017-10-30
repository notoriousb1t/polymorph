import { IPathSegment, IPath, InterpolateOptions, FloatArray, Matrix } from '../types'
import { reversePoints } from './reversePoints'
import { fillSegments } from './fillSegments'
import { normalizePoints } from './normalizePoints'
import { fillPoints } from './fillPoints'
import { intersects } from '../utilities/intersects'
import { INSERT, PRESERVE, CLOCKWISE } from '../constants'
import { raiseError } from '../utilities/errors'

function sizeDesc(a: IPathSegment, b: IPathSegment): number {
    return b.p - a.p
}

export function normalizePaths(left: IPath, right: IPath, options: InterpolateOptions): FloatArray[][] {
    // sort segments by perimeter size (more or less area)
    let leftPath = left.data.slice().sort(sizeDesc)
    let rightPath = right.data.slice().sort(sizeDesc)

    if (leftPath.length !== rightPath.length) {
        if (options.fillStrategy === INSERT) {
            // ensure there are an equal amount of segments
            fillSegments(leftPath, rightPath)
        } else {
            raiseError('fillStrategy:preserve requires equal lengths')
        }
    }

    const matrix: Matrix = [leftPath.map(toPoints), rightPath.map(toPoints)]

    if (options.wind !== PRESERVE) {
        const goClockwise = options.wind === CLOCKWISE
        for (let i = 0; i < leftPath.length; i++) {
            if (isClockwise(leftPath[i]) === goClockwise) {
                leftPath[i].d = reversePoints(leftPath[i].d)
            }
            if (isClockwise(rightPath[i]) === goClockwise) {
                rightPath[i].d = reversePoints(rightPath[i].d)
            }
        }
    }

    if (!!options.align) {
        // shift so both svg's are being drawn from relatively the same place
        for (let i = 0; i < leftPath.length; i++) {
            const ls = leftPath[i]
            normalizePoints(ls.x, ls.y, matrix[0][i])
            const rs = rightPath[i]
            normalizePoints(rs.x, rs.y, matrix[1][i])
        }
    }

    if (options.fillStrategy === INSERT) {
        fillPoints(matrix, options.addPoints * 6)
    }
    return matrix
}

function toPoints(p: IPathSegment): FloatArray {
    return p.d
}

/**
 * Attempts to detect the winding direction by waiting for the first intersection of the mid-point.  This
 * is not a perfect solution but it should solve a large majority of cases
 * @param path
 */
export function isClockwise(path: IPathSegment): boolean {
    const pts = path.d
    const n = pts.length
    const x4 = path.x + path.w
    const y4 = path.y + path.h
    const isUpper = path.ox - path.x > 0

    let x1 = pts[n - 2]
    let y1 = pts[n - 1]
    for (let i = 0; i < n; i += 6) {
        const x2 = pts[i]
        const y2 = pts[i + 1]
        if (intersects(x1, y1, x2, y2, path.x, path.y, x4, y4)) {
            const forward = x2 - x1 > 0
            return (forward && isUpper) || (!forward && !isUpper)
        }
    }
    return false
}
