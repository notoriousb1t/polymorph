import { renderPath } from './operators/render-path';
import { parsePoints } from './operators/parse-path';
import { getPath } from './get-path';

/**
 * Converts the path data to a sequence of poly-beziers and returns it as a string
 * @param d path data, CSS selector, or path element
 */
export function toBezier(d: string): string {
  return renderPath(parsePoints(getPath(d)));
}
