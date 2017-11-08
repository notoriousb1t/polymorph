import {
    PI,
    abs,
    cos,
    sin,
    tan,
    sqrt,
    asin
    // cos, sin, sqrt, asin, tan
} from '../utilities/math'

const _120 = PI * 120 / 180
const PI2 = PI * 2

export function arcToCurve(
    x1: number,
    y1: number,
    rx: number,
    ry: number,
    angle: number,
    large: number,
    sweep: number,
    dx: number,
    dy: number,
    f1?: number,
    f2?: number,
    cx?: number,
    cy?: number
): any {
    if (rx <= 0 || ry <= 0) {
        return [x1, y1, dx, dy, dx, dy]
    }

    const rad = PI / 180 * (+angle || 0)
    const cosrad = cos(rad)
    const sinrad = sin(rad)
    const recursive = !!f1

    if (!recursive) {
        const x1old = x1
        const dxold = dx
        x1 = x1old * cosrad - y1 * -sinrad
        y1 = x1old * -sinrad + y1 * cosrad
        dx = dxold * cosrad - dy * -sinrad
        dy = dxold * -sinrad + dy * cosrad

        const x = (x1 - dx) / 2
        const y = (y1 - dy) / 2

        let h = x * x / (rx * rx) + y * y / (ry * ry)
        if (h > 1) {
            h = sqrt(h)
            rx = h * rx
            ry = h * ry
        }

        const k =
            (large === sweep ? -1 : 1) *
            sqrt(abs((rx * rx * ry * ry - rx * rx * y * y - ry * ry * x * x) / (rx * rx * y * y + ry * ry * x * x)))

        cx = k * rx * y / ry + (x1 + dx) / 2
        cy = k * -ry * x / rx + (y1 + dy) / 2

        f1 = asin((y1 - cy) / ry)
        f2 = asin((dy - cy) / ry)

        if (x1 < cx) {
            f1 = PI - f1
        }
        if (dx < cx) {
            f2 = PI - f2
        }
        if (f1 < 0) {
            f1 += PI2
        }
        if (f2 < 0) {
            f2 += PI2
        }
        if (sweep && f1 > f2) {
            f1 -= PI2
        }
        if (!sweep && f2 > f1) {
            f2 -= PI2
        }
    }

    let res: number[]
    if (abs(f2 - f1) > _120) {
        const f2old = f2
        const x2old = dx
        const y2old = dy

        f2 = f1 + _120 * (sweep && f2 > f1 ? 1 : -1)
        dx = cx + rx * cos(f2)
        dy = cy + ry * sin(f2)
        res = arcToCurve(dx, dy, rx, ry, angle, 0, sweep, x2old, y2old, f2, f2old, cx, cy)
    } else {
        res = []
    }

    const t = 4 / 3 * tan((f2 - f1) / 4)

    // insert this curve into the beginning of the array
    res.splice(
        0,
        0,
        2 * x1 - (x1 + t * rx * sin(f1)),
        2 * y1 - (y1 - t * ry * cos(f1)),
        dx + t * rx * sin(f2),
        dy - t * ry * cos(f2),
        dx,
        dy
    )

    if (!recursive) {
        // if this is a top-level arc, rotate into position
        for (let i = 0, ilen = res.length; i < ilen; i += 2) {
            const xt = res[i], yt = res[i + 1]
            res[i] = xt * cosrad - yt * sinrad
            res[i + 1] = xt * sinrad + yt * cosrad
        }
    }

    return res
}
