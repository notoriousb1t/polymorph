import { _, Z, T, Q, S, C, V, H, EMPTY, A, M, L } from '../constants';
import { coalesce } from '../utilities/coalesce';
import { IParseContext, FloatArray } from '../types';
import { raiseError } from '../utilities/errors';
import { quadraticRatio } from '../utilities/math';
import { arcToCurve } from './arcToCurve';

// describes the number of arguments each command has
const argLengths = { M: 2, H: 1, V: 1, L: 2, Z: 0, C: 6, S: 4, Q: 4, T: 2, A: 7 };

/**
 * Adds a curve to the segment
 * @param ctx Parser context
 * @param x1 start control point x
 * @param y1 start control point y
 * @param x2 end control point x
 * @param y2 end control point y
 * @param dx destination x
 * @param dy destination y
 */
function addCurve(
  ctx: IParseContext,
  x1: number | undefined,
  y1: number | undefined,
  x2: number | undefined,
  y2: number | undefined,
  dx: number | undefined,
  dy: number | undefined
): void {
  // store x and y
  const x = ctx.x;
  const y = ctx.y;

  // move cursor
  ctx.x = coalesce(dx, x);
  ctx.y = coalesce(dy, y);

  // add numbers to points
  ctx.p.push(coalesce(x1, x), (y1 = coalesce(y1, y)), (x2 = coalesce(x2, x)), (y2 = coalesce(y2, y)), ctx.x, ctx.y);

  // set last command type
  ctx.lc = ctx.c;
}

/**
 * Converts the current terms in the context to absolute position based on the
 * current cursor position
 * @param ctx Parser context
 */
function convertToAbsolute(ctx: IParseContext): void {
  const c = ctx.c;
  const t = ctx.t;
  const x = ctx.x;
  const y = ctx.y;

  if (c === V) {
    t[0] += y;
  } else if (c === H) {
    t[0] += x;
  } else if (c === A) {
    t[5] += x;
    t[6] += y;
  } else {
    for (let j = 0; j < t.length; j += 2) {
      t[j] += x;
      t[j + 1] += y;
    }
  }
}

function parseSegments(d: string): (string | number)[][] {
  // replace all terms with space + term to remove garbage
  // replace command letters with an additional space
  // remove spaces around
  // split on double-space (splits on command segment)
  // parse each segment into an of list of command + args
  return d
    .replace(/[\^\s]*([mhvlzcsqta]|\-?\d*\.?\d+)[,\$\s]*/gi, ' $1')
    .replace(/([mhvlzcsqta])/gi, ' $1')
    .trim()
    .split('  ')
    .map(parseSegment);
}

function parseSegment(s2: string): (string | number)[] {
  // split command segment into command + args
  return s2.split(EMPTY).map(parseCommand);
}

function parseCommand(str: string, i: number): string | number {
  // convert all terms except command into a number
  return i === 0 ? str : +str;
}

/**
 * Returns an [] with cursor position + polybezier [mx, my, ...[x1, y1, x2, y2, dx, dy] ]
 * @param d string to parse
 */
export function parsePoints(d: string): FloatArray[] {
  // create parser context
  const ctx: IParseContext = {
    x: 0,
    y: 0,
    s: []
  };

  // split into segments
  const segments = parseSegments(d);

  // start building
  for (let i = 0; i < segments.length; i++) {
    const terms = segments[i];
    const commandLetter = terms[0] as string;

    // setup context
    const command = commandLetter.toUpperCase();
    const isRelative = command !== Z && command !== commandLetter;

    // set command on context
    ctx.c = command;

    const maxLength = argLengths[command];

    // process each part of this command.  Use do-while to accomodate Z
    const t2 = terms as number[];
    let k = 1;
    do {
      // split this segment into a sub-segment
      ctx.t = t2.length === 1 ? t2 : t2.slice(k, k + maxLength);

      // convert to absolute if necessary
      if (isRelative) {
        convertToAbsolute(ctx);
      }
      // parse

      const n = ctx.t;
      const x = ctx.x;
      const y = ctx.y;

      let x1: number, y1: number, dx: number, dy: number, x2: number, y2: number;

      if (command === M) {
        ctx.s.push((ctx.p = [(ctx.x = n[0]), (ctx.y = n[1])]));
      } else if (command === H) {
        addCurve(ctx, _, _, _, _, n[0], _);
      } else if (command === V) {
        addCurve(ctx, _, _, _, _, _, n[0]);
      } else if (command === L) {
        addCurve(ctx, _, _, _, _, n[0], n[1]);
      } else if (command === Z) {
        addCurve(ctx, _, _, _, _, ctx.p[0], ctx.p[1]);
      } else if (command === C) {
        addCurve(ctx, n[0], n[1], n[2], n[3], n[4], n[5]);

        // set last control point for sub-sequence C/S
        ctx.cx = n[2];
        ctx.cy = n[3];
      } else if (command === S) {
        const isInitialCurve = ctx.lc !== S && ctx.lc !== C;
        x1 = isInitialCurve ? _ : x * 2 - ctx.cx;
        y1 = isInitialCurve ? _ : y * 2 - ctx.cy;

        addCurve(ctx, x1, y1, n[0], n[1], n[2], n[3]);

        // set last control point for sub-sequence C/S
        ctx.cx = n[0];
        ctx.cy = n[1];
      } else if (command === Q) {
        const cx1 = n[0];
        const cy1 = n[1];
        dx = n[2];
        dy = n[3];

        addCurve(
          ctx,
          x + (cx1 - x) * quadraticRatio,
          y + (cy1 - y) * quadraticRatio,
          dx + (cx1 - dx) * quadraticRatio,
          dy + (cy1 - dy) * quadraticRatio,
          dx,
          dy
        );

        ctx.cx = cx1;
        ctx.cy = cy1;
      } else if (command === T) {
        dx = n[0];
        dy = n[1];

        if (ctx.lc === Q || ctx.lc === T) {
          x1 = x + (x * 2 - ctx.cx - x) * quadraticRatio;
          y1 = y + (y * 2 - ctx.cy - y) * quadraticRatio;
          x2 = dx + (x * 2 - ctx.cx - dx) * quadraticRatio;
          y2 = dy + (y * 2 - ctx.cy - dy) * quadraticRatio;
        } else {
          x1 = x2 = x;
          y1 = y2 = y;
        }

        addCurve(ctx, x1, y1, x2, y2, dx, dy);

        ctx.cx = x2;
        ctx.cy = y2;
      } else if (command === A) {
        const beziers = arcToCurve(x, y, n[0], n[1], n[2], n[3], n[4], n[5], n[6]);

        for (let j = 0; j < beziers.length; j += 6) {
          addCurve(ctx, beziers[j], beziers[j + 1], beziers[j + 2], beziers[j + 3], beziers[j + 4], beziers[j + 5]);
        }
      } else {
        raiseError(ctx.c, ' is not supported');
      }

      k += maxLength;
    } while (k < t2.length);
  }

  // return segments with the largest sub-paths first
  // this makes it more likely that holes will be filled
  return ctx.s;
}
