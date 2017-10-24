import { M, C } from '../constants'
import { isString } from '../utilities/inspect';
import { floor } from '../utilities/math';

/**
 * Converts poly-bezier data back to SVG Path data.
 * @param ns poly-bezier data
 */
export function renderPath(ns: number[][] | string): string {
    if (isString(ns)) {
        return ns as string
    }
    const parts: string[] = []
    for (let i = 0; i < ns.length; i++) {
        const n = ns[i] as number[]
        parts.push(M, formatNumber(n[0]), formatNumber(n[1]), C)
        for (let f = 2; f < n.length; f++) {
            parts.push(formatNumber(n[f]))
        }
    }
    return parts.join(' ')
}

/**
 * Formats a number to the nearest .01
 * @param n number to format
 */
function formatNumber(n: number): string {
    return (floor(n * 100) / 100).toString()
}
