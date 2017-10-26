import { sqrt } from './math';

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}
