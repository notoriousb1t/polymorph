import { rotatePoints } from './rotatePoints'
import { _ } from '../constants'
import { distance } from '../utilities/distance'
import { FloatArray } from '../types'
import { computeAbsoluteOrigin } from './computeAbsoluteOrigin';

export function normalizePoints(absolute: boolean, originX: number, originY: number, ns: FloatArray): void {
    let len = ns.length
    if (ns[len - 2] !== ns[0] || ns[len - 1] !== ns[1]) {
        // skip redraw if this is not a closed shape
        return
    }

    if (!absolute) {
        const relativeOrigin = computeAbsoluteOrigin(originX, originY, ns);
        originX = relativeOrigin.x;
        originY = relativeOrigin.y;
    }

    // create buffer to hold rotating data
    const buffer = ns.slice(2)
    len = buffer.length

    // find the index of the shortest distance from the upper left corner
    let index: number, minAmount: number
    for (let i = 0; i < len; i += 6) {
        // find the distance to the upper left corner
        const next = distance(originX, originX, buffer[i], buffer[i + 1])

        if (minAmount === _ || next < minAmount) {
            // capture the amount and set the index
            minAmount = next
            index = i
        }
    }

    // rotate the points so that index is drawn first
    rotatePoints(buffer, index)

    // copy starting position from ending rotated position
    ns[0] = buffer[len - 2]
    ns[1] = buffer[len - 1]

    // copy rotated/aligned back onto original
    for (let i = 0; i < buffer.length; i++) {
        ns[i + 2] = buffer[i]
    }
}


