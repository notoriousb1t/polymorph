import { max } from '../utilities/math';
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

export function fillSubpath(ns: FloatArray, totalLength: number): FloatArray  {
  let totalNeeded = totalLength - ns.length; 
  const ratio = Math.ceil(totalLength / ns.length);
  const result = createNumberArray(totalLength);
 
  result[0] = ns[0];
  result[1] = ns[1];
 
  let k = 1, j = 1;
  while (j < totalLength - 1) {
      result[++j] = ns[++k];
      result[++j] = ns[++k];
      result[++j] = ns[++k];
      result[++j] = ns[++k];
      const dx = result[++j] = ns[++k];
      const dy = result[++j] = ns[++k]; 
     
      if (totalNeeded) {
        for (let f = 0; f < ratio && totalNeeded; f++) { 
          result[j + 5] = result[j + 3] = result[j + 1] = dx;
          result[j + 6] = result[j + 4] = result[j + 2] = dy;
          j += 6;
          totalNeeded -= 6;
        } 
      }
  }
  return result;
}
