import { IOrigin, FloatArray } from '../types';
import { createNumberArray } from '../utilities/createNumberArray';
import { computeAbsoluteOrigin } from './computeAbsoluteOrigin';


export function fillSegments(larger: FloatArray[], smaller: FloatArray[], origin: IOrigin): void {
    const largeLen = larger.length
    const smallLen = smaller.length
    if (largeLen < smallLen) {
        // swap sides so larger is larger (or equal)
        return fillSegments(smaller, larger, origin)
    }

    // resize the array
    smaller.length = largeLen;
    for (let i = smallLen; i < largeLen; i++) {
        const l = larger[i]
        let originX = origin.x;
        let originY = origin.y;
        if (!origin.absolute) {
            const absoluteOrigin = computeAbsoluteOrigin(originX, originY, l);
            originX = absoluteOrigin.x;
            originY = absoluteOrigin.y;
        }

        const d = createNumberArray(l.length)
        for (let k = 0; k < l.length; k += 2) {
            d[k] = originX;
            d[k + 1] = originY;
        }

        smaller[i] = d;
    }
}
