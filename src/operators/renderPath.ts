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

        result += M + EMPTY + formatter(n[0]) + EMPTY + formatter(n[1]) + EMPTY + C
        for (let f = 2; f < n.length; f++) {
            result += EMPTY + formatter(n[f])
        }
    }
    return result
}
