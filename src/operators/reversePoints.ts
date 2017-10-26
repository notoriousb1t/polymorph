export function reversePoints(s: number[]): number[] {
    const d = s.slice(-2)
    for (let i = s.length - 3; i > -1; i -= 6) {
        d.push(s[i - 1], s[i], s[i - 3], s[i - 2], s[i - 5], s[i - 4])
    }
    return d
}
