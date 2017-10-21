import { IPathSegment } from '../types';
import { renderPath } from './render-path';

export function mix(leftSegments: IPathSegment[], rightSegments: IPathSegment[]): (offset: number) => string {
  const l = leftSegments.map((s: IPathSegment) => s.d);
  const r = rightSegments.map((s: IPathSegment) => s.d);

  return (offset: number) => renderPath(mixPointArrays(l, r, offset))
}

function mixPointArrays(l: number[][], r: number[][], o: number): number[][] {
  return l.map((a: number[], h: number) => mixPoints(a, r[h], o));
}

export function mixPoints(a: number[], b: number[], o: number): number[] {
  // paths should be the same length
  const results: number[] = []
  for (let i = 0; i < a.length; i++) {
    results.push(a[i] + (b[i] - a[i]) * o)
  }
  return results
}
