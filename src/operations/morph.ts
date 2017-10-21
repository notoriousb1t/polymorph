import { mix } from './mix';
import { parse } from './parse';

export function morph(left: string, right: string): (offset: number) => string {
  return mix(parse(left), parse(right))
}
