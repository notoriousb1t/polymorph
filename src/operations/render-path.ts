
export function renderPath(ns: number[][]): string {
    const parts: string[] = []
    for (let i = 0; i < ns.length; i++) {
        const n = ns[i]
        parts.push('M', formatNumber(n[0]), formatNumber(n[1]), 'C')
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
    return (Math.round(n * 100) / 100).toString()
}
