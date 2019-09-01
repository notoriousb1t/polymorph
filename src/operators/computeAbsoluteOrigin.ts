import { FloatArray } from '../types';
import { min, max } from '../utilities/math';

function computeDimensions(points: FloatArray): {
    x: number;
    y: number;
    w: number;
    h: number;
} {
    let xmin = points[0];
    let ymin = points[1];
    let ymax = ymin;
    let xmax = xmin;
    for (let i = 2; i < points.length; i += 6) {
        let x = points[i + 4];
        let y = points[i + 5];
        xmin = min(xmin, x);
        xmax = max(xmax, x);
        ymin = min(ymin, y);
        ymax = max(ymax, y);
    }
    return {
        x: xmin,
        w: (xmax - xmin),
        y: ymin,
        h: (ymax - ymin)
    };
}

export function computeAbsoluteOrigin(relativeX: number, relativeY: number, points: FloatArray): {x: number, y: number} {
    const dimensions = computeDimensions(points);
    return {
        x: dimensions.x + dimensions.w * relativeX,
        y: dimensions.y + dimensions.h * relativeY
    };
}
