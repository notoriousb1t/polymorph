// tslint:disable-next-line:max-line-length
import { _,  SPACE, DRAW_LINE_VERTICAL, DRAW_LINE_HORIZONTAL, DRAW_ARC, CLOSE_PATH, MOVE_CURSOR, DRAW_LINE, DRAW_CURVE_CUBIC_BEZIER, DRAW_CURVE_SMOOTH, DRAW_CURVE_QUADRATIC, DRAW_CURVE_QUADRATIC_CONTINUATION } from '../constants';
import { coalesce } from '../utilities/coalesce';
import { IParseContext, FloatArray } from '../types';
import { raiseError } from '../utilities/errors';
import { QUADRATIC_RATIO } from '../utilities/math';
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
  ctx.current.push(coalesce(x1, x), (y1 = coalesce(y1, y)), (x2 = coalesce(x2, x)), (y2 = coalesce(y2, y)), ctx.x, ctx.y);

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

  if (c === DRAW_LINE_VERTICAL) {
    t[0] += y;
  } else if (c === DRAW_LINE_HORIZONTAL) {
    t[0] += x;
  } else if (c === DRAW_ARC) {
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
  return s2.split(SPACE).map(parseCommand);
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
    segments: []
  };

  // split into segments
  const segments = parseSegments(d);

  // start building
  for (let i = 0; i < segments.length; i++) {
    const terms = segments[i];
    const commandLetter = terms[0] as string;

    // setup context
    const command = commandLetter.toUpperCase();
    const isRelative = command !== CLOSE_PATH && command !== commandLetter;

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

      if (command === MOVE_CURSOR) {
        ctx.segments.push((ctx.current = [(ctx.x = n[0]), (ctx.y = n[1])]));
      } else if (command === DRAW_LINE_HORIZONTAL) {
        addCurve(ctx, _, _, _, _, n[0], _);
      } else if (command === DRAW_LINE_VERTICAL) {
        addCurve(ctx, _, _, _, _, _, n[0]);
      } else if (command === DRAW_LINE) {
        addCurve(ctx, _, _, _, _, n[0], n[1]);
      } else if (command === CLOSE_PATH) {
        addCurve(ctx, _, _, _, _, ctx.current[0], ctx.current[1]);
      } else if (command === DRAW_CURVE_CUBIC_BEZIER) {
        addCurve(ctx, n[0], n[1], n[2], n[3], n[4], n[5]);

        // set last control point for sub-sequence C/S
        ctx.cx = n[2];
        ctx.cy = n[3];
      } else if (command === DRAW_CURVE_SMOOTH) {
        const isInitialCurve = ctx.lc !== DRAW_CURVE_SMOOTH && ctx.lc !== DRAW_CURVE_CUBIC_BEZIER;
        x1 = isInitialCurve ? _ : x * 2 - ctx.cx;
        y1 = isInitialCurve ? _ : y * 2 - ctx.cy;

        addCurve(ctx, x1, y1, n[0], n[1], n[2], n[3]);

        // set last control point for sub-sequence C/S
        ctx.cx = n[0];
        ctx.cy = n[1];
      } else if (command === DRAW_CURVE_QUADRATIC) {
        const cx1 = n[0];
        const cy1 = n[1];
        dx = n[2];
        dy = n[3];

        addCurve(
          ctx,
          x + (cx1 - x) * QUADRATIC_RATIO,
          y + (cy1 - y) * QUADRATIC_RATIO,
          dx + (cx1 - dx) * QUADRATIC_RATIO,
          dy + (cy1 - dy) * QUADRATIC_RATIO,
          dx,
          dy
        );

        ctx.cx = cx1;
        ctx.cy = cy1;
      } else if (command === DRAW_CURVE_QUADRATIC_CONTINUATION) {
        dx = n[0];
        dy = n[1];

        if (ctx.lc === DRAW_CURVE_QUADRATIC || ctx.lc === DRAW_CURVE_QUADRATIC_CONTINUATION) {
          x1 = x + (x * 2 - ctx.cx - x) * QUADRATIC_RATIO;
          y1 = y + (y * 2 - ctx.cy - y) * QUADRATIC_RATIO;
          x2 = dx + (x * 2 - ctx.cx - dx) * QUADRATIC_RATIO;
          y2 = dy + (y * 2 - ctx.cy - dy) * QUADRATIC_RATIO;
        } else {
          x1 = x2 = x;
          y1 = y2 = y;
        }

        addCurve(ctx, x1, y1, x2, y2, dx, dy);

        ctx.cx = x2;
        ctx.cy = y2;
      } else if (command === DRAW_ARC) {
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
  return ctx.segments;
}
