import { M, C, EMPTY } from '../constants'
import { isString } from '../utilities/inspect'
import { FloatArray, Func } from '../types'

/**
 * Converts poly-bezier data back to SVG Path data.
 * @param ns poly-bezier data
 */
export function renderPath(ns: FloatArray[] | string, formatter: Func<number, number | string>): string {
    if (isString(ns)) {
        return ns as string
    }

    let result = ''
    for (let i = 0; i < ns.length; i++) {
        const n = ns[i] as FloatArray

        // store initial cursor position
        let cx = n[0]
        let cy = n[1]

        result += M + EMPTY + formatter(cx) + EMPTY + formatter(cy) + EMPTY + C
        for (let f = 2; f < n.length; f += 6) {
            const x1 = n[f]
            const y1 = n[f + 1]
            const x2 = n[f + 2]
            const y2 = n[f + 3]
            const dx = n[f + 4]
            const dy = n[f + 5]

            // check if X and Y have moved at all
            const sameX = cx === dx && cx === x1 && cx === x2
            const sameY = cy === dy && cy === y1 && cy === y2

            if (sameX && sameY) {
                // skip this set of points if there is zero-net effect
                continue
            }

            cx = dx
            cy = dy

            result +=
                EMPTY +
                formatter(x1) +
                EMPTY +
                formatter(y1) +
                EMPTY +
                formatter(x2) +
                EMPTY +
                formatter(y2) +
                EMPTY +
                formatter(dx) +
                EMPTY +
                formatter(dy)
        }
    }
    return result
}
