import { IPathSegment, IPath } from '../types'
import { parsePoints } from './parsePoints'
import { min, max } from '../utilities/math';

function createPathSegmentArray(points: number[]): IPathSegment {
    let xmin: number, xmax: number, ymin: number, ymax: number

    // get initial x,y from move command
    xmin = xmax = points[0]
    ymin = ymax = points[1]

    for (let i = 2; i < points.length; i += 6) {
        let x = points[i + 4]
        let y = points[i + 5]

        xmin = min(xmin, x)
        xmax = max(xmax, x)
        ymin = min(ymin, y)
        ymax = max(ymax, y)
    }

    return {
        d: points,
        x: xmin,
        y: ymin,
        w: xmax - xmin,
        h: ymax - ymin
    }
}

export function parsePath(d: string): IPath {
    return {
        path: d,
        data: parsePoints(d).map(createPathSegmentArray)
    }
}
