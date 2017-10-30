import { FloatArray } from '../types'
import { createNumberArray } from '../utilities/createNumberArray';

export function reversePoints(s: FloatArray): FloatArray {
    const d = createNumberArray(s.length)
    const slen = s.length
    d[0] = s[slen - 2]
    d[1] = s[slen - 1]

    let k = 1
    for (let i = s.length - 3; i > -1; i -= 6) {
        d[++k] = s[i - 1]
        d[++k] = s[i]
        d[++k] = s[i - 3]
        d[++k] = s[i - 2]
        d[++k] = s[i - 5]
        d[++k] = s[i - 4]
    }

    return d
}
