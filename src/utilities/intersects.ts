function ctns(a: number, b1: number, b2: number): boolean {
    return (a >= b1 && a <= b2) || (a >= b2 && a <= b1)
}

export function intersects(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
): boolean {
    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (d === 0) {
        return false
    }

    const x = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4) / d
    const y = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4) / d

    return ctns(x, x1, x2) && ctns(y, y1, y2) && ctns(x, x3, x4) && ctns(y, y3, y4)
}
