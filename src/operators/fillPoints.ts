import { round, max } from '../utilities/math';
import { FloatArray, Matrix } from '../types';
import { createNumberArray } from '../utilities/createNumberArray';

export function fillPoints(matrix: Matrix, addPoints: number): void {
  const ilen = matrix[0].length
  for (let i = 0; i < ilen; i++) {
    const left = matrix[0][i]
    const right = matrix[1][i]

    // find the target length
    const totalLength = max(left.length + addPoints, right.length + addPoints);

    matrix[0][i] = fillSubpath(left, totalLength);
    matrix[1][i] = fillSubpath(right, totalLength);
  }
}

export function fillSubpath(ns: FloatArray, totalLength: number): FloatArray {
  const result = createNumberArray(totalLength)
  const slen = ns.length;
  const totalNeeded = totalLength - slen
  const ratio = totalNeeded / slen;
  let remaining = totalNeeded

  // copy starting position
  result[0] = ns[0]
  result[1] = ns[1]

  // copy to a new array and fill in gaps as possible
  let k = 1, j = 1;
  while (j < totalLength - 1) {
     result[j + 1] = ns[k + 1]
     result[j + 2] = ns[k + 2]
     result[j + 3] = ns[k + 3]
     result[j + 4] = ns[k + 4]

     const dx = result[j + 5] = ns[k + 5]
     const dy = result[j + 6] = ns[k + 6]
     j += 6
     k += 6

     if (remaining) {
        let total = round(ratio)
        if (k === slen - 1) {
           total = totalLength - j
        }

        for (let i = 0; i < total && remaining > 0; i++) {
            result[j + 1] = result[j + 3] = result[j + 5] = dx
            result[j + 2] = result[j + 4] = result[j + 6] = dy
            j += 6
            remaining -= 6
        }
     }
  }

  return result;
}
