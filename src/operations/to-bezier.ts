import { renderPath } from './render-path';
import { parsePath } from './parse-path';

export function toBezier(d: string): string {
  return renderPath(parsePath(d));
}
