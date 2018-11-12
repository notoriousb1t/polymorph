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

    let result = ""
    for (let i = 0; i < ns.length; i++) {
        const n = ns[i] as FloatArray
        result += M + formatter(n[0]) + EMPTY + formatter(n[1]) + C;

        let lastResult;
        for (let f = 2; f < n.length; f += 6) {
            const p0 = formatter(n[f])
            const p1 = formatter(n[f+1])
            const p2 = formatter(n[f+2])
            const p3 = formatter(n[f+3])
            const dx = formatter(n[f+4])
            const dy = formatter(n[f+5])

            const isPoint = p0 == dx && p2 == dx && p1 == dy && p3 == dy;

            // prevent duplicate points from rendering
            if (!isPoint || lastResult != (lastResult = ('' + p0 + p1 + p2 + p3 + dx + dy))) {
              result += EMPTY + p0 + EMPTY + p1 + EMPTY + p2 + EMPTY + p3 + EMPTY + dx + EMPTY + dy;
            }
        }
    }
    return result;
}
