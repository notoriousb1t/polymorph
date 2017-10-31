import { IPathSegment, IPath, FloatArray } from '../types'
import { parsePoints } from './parsePoints'
import { min, max } from '../utilities/math'
import { perimeterPoints } from './perimeterPoints'

function createPathSegmentArray(points: FloatArray): IPathSegment {
    // get initial x,y from move command
    let xmin = points[0]
    let ymin = points[1]
    let ymax = ymin
    let xmax = xmin

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
        h: ymax - ymin,
        p: perimeterPoints(points)
    }
}

export function parsePath(d: string): IPath {
    return {
        path: d,
        data: parsePoints(d).map(createPathSegmentArray)
    }
}
