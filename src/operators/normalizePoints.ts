import { rotatePoints } from './rotatePoints';
import { _ } from '../constants';
import { distance } from '../utilities/distance';

export function normalizePoints(x: number, y: number, ns: number[]): void {
  let len = ns.length
  if (ns[len - 2] !== ns[0] || ns[len - 1] !== ns[1]) {
      // skip redraw if this is not a closed shape
      return
  }

  // remove starting position and recalculate length
  ns.splice(0, 2)
  len = ns.length

  // find the index of the shortest distance from the upper left corner
  let index: number, minAmount: number
  for (let i = 0; i < len; i += 6) {
      // find the distance to the upper left corner
      const next = distance(x, y, ns[i], ns[i + 1])

      if (minAmount === _ || next < minAmount) {
          // capture the amount and set the index
          minAmount = next
          index = i
      }
  }

  // rotate the points so that index is drawn first
  rotatePoints(ns, index)

  // reinsert a new starting position
  ns.splice(0, 0, ns[len - 2], ns[len - 1])
}
