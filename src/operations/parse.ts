import { IPathSegment } from '../types'
import { parsePath } from './parse-path'

export function parse(d: string): IPathSegment[] {
    return parsePath(d).map(createPathSegmentArray)
}

function createPathSegmentArray(points: number[]): IPathSegment {
    let xmin: number, xmax: number, ymin: number, ymax: number

    // get initial x,y from move command
    xmin = xmax = points[0]
    ymin = ymax = points[1]

    for (let i = 2; i < points.length; i += 6) {
        let x = points[i + 4]
        let y = points[i + 5]

        xmin = Math.min(xmin, x)
        xmax = Math.min(xmax, x)
        ymin = Math.min(ymin, y)
        ymax = Math.min(ymax, y)
    }

    return {
        d: points,
        x: xmin,
        y: ymin,
        w: xmax - xmin,
        h: ymax - ymin
    }
}
