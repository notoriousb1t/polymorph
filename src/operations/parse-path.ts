import { _, Z, T, Q, S, C } from '../constants'
import { coalesce } from '../utilities/coalesce'

// for parsing poly-commands
// const argLengths = { M: 2, H: 1, V: 1, L: 2, Z: 0, C: 6, S: 4, Q: 4 }

interface IParseContext {
    /**
     * Cursor X position
     */
    x: number
    /**
     * Cursor Y position
     */
    y: number
    /**
     * Last Control X
     */
    cx: number
    /**
     * Last Control Y
     */
    cy: number
    /**
     * Last command that was seen
     */
    lc: string
    /**
     * Current command being parsed
     */
    c: string
    /**
     * Terms being parsed
     */
    t: number[]
    /**
     * All segments
     */
    s: number[][]
    /**
     * Current poly-bezier. (The one being bult)
     */
    p: number[]
}

const quadraticRatio = 2.0 / 3

function m(ctx: IParseContext): void {
    const n = ctx.t
    addSegment(ctx, n[1], n[2])
}
function h(ctx: IParseContext): void {
    addCurve(ctx, _, _, _, _, ctx.t[1], _)
}
function v(ctx: IParseContext): void {
    addCurve(ctx, _, _, _, _, _, ctx.t[1])
}
function l(ctx: IParseContext): void {
    const n = ctx.t
    addCurve(ctx, _, _, _, _, n[1], n[2])
}
function z(ctx: IParseContext): void {
    addCurve(ctx, _, _, _, _, ctx.p[0], ctx.p[1])
}
function c(ctx: IParseContext): void {
    const n = ctx.t
    addCurve(ctx, n[1], n[2], n[3], n[4], n[5], n[6])

    // set last control point for subsequence C/S
    ctx.cx = n[1]
    ctx.cy = n[2]
}
function s(ctx: IParseContext): void {
    const n = ctx.t
    const isInitialCurve = ctx.lc !== S && ctx.lc !== C
    const x1 = isInitialCurve ? _ : ctx.x * 2 - ctx.cx
    const y1 = isInitialCurve ? _ : ctx.y * 2 - ctx.cy

    addCurve(ctx, x1, y1, n[1], n[2], n[3], n[4])

    // set last control point for subsequence C/S
    ctx.cx = n[1]
    ctx.cy = n[2]
}
function q(ctx: IParseContext): void {
    const n = ctx.t
    const cx1 = n[1]
    const cy1 = n[2]
    const dx = n[3]
    const dy = n[4]

    addCurve(
        ctx,
        ctx.x + (cx1 - ctx.x) * quadraticRatio,
        ctx.y + (cy1 - ctx.y) * quadraticRatio,
        dx + (cx1 - dx) * quadraticRatio,
        dy + (cy1 - dy) * quadraticRatio,
        dx,
        dy
    )

    ctx.cx = cx1
    ctx.cy = cy1
}
function t(ctx: IParseContext): void {
    const n = ctx.t
    const dx = n[1]
    const dy = n[2]

    let x1: number, y1: number, x2: number, y2: number
    if (ctx.lc === Q || ctx.lc === T) {
      const cx1 = ctx.x * 2 - ctx.cx
      const cy1 = ctx.y * 2 - ctx.cy
      x1 = ctx.x + (cx1 - ctx.x) * quadraticRatio;
      y1 = ctx.y + (cy1 - ctx.y) * quadraticRatio;
      x2 = dx + (cx1 - dx) * quadraticRatio;
      y2 = dy + (cy1 - dy) * quadraticRatio;
    } else {
      x1 = x2 = ctx.x
      y1 = y2 = ctx.y
    }

    addCurve(ctx, x1, y1, x2, y2, dx, dy)

    ctx.cx = x2;
    ctx.cy = y2;
}

const parsers = {
    M: m,
    H: h,
    V: v,
    L: l,
    Z: z,
    C: c,
    S: s,
    Q: q,
    T: t
}

function addSegment(ctx: IParseContext, x: number, y: number): void {
    ctx.x = x
    ctx.y = y

    const p: number[] = [x, y]
    ctx.s.push(p)
    ctx.p = p
}

function addCurve(
    ctx: IParseContext,
    x1: number | undefined,
    y1: number | undefined,
    x2: number | undefined,
    y2: number | undefined,
    dx: number | undefined,
    dy: number | undefined
): void {
    const x = ctx.x
    const y = ctx.y

    // ensure values
    x1 = coalesce(x1, x)
    y1 = coalesce(y1, y)
    x2 = coalesce(x2, x)
    y2 = coalesce(y2, y)
    dx = coalesce(dx, x)
    dy = coalesce(dy, y)

    // add numbers to points
    ctx.p.push(x1, y1, x2, y2, dx, dy)

    // move cursor
    ctx.x = dx
    ctx.y = dy

    // set last command type
    ctx.lc = ctx.c
}

/**
 * Returns an [] with cursor position + polybezier [mx, my, ...[x1, y1, x2, y2, dx, dy] ]
 * @param d string to parse
 */
export function parsePath(d: string): number[][] {
    // create parser context
    const ctx: IParseContext = {
        x: 0,
        y: 0,
        lc: _,
        c: _,
        cx: _,
        cy: _,
        t: _,
        s: [],
        p: _
    }

    // split into segments
    const segments = parseSegments(d)

    // start building
    for (let i = 0; i < segments.length; i++) {
        const terms = segments[i]
        const commandLetter = terms[0] as string

        // setup context
        const command = commandLetter.toUpperCase()
        ctx.c = command
        ctx.t = terms as number[]

        // find command parser
        const parser = parsers[ctx.c]
        if (!parser) {
            throw new Error(ctx.c + ' is not supported')
        }

        if (command !== Z && command !== commandLetter) {
            ensureAbsolute(ctx)
        }

        // parse
        parser(ctx)
    }

    // return points
    return ctx.s
}

function ensureAbsolute(ctx: IParseContext): void {
    if (ctx.c === 'V') {
        ctx.t[1] += ctx.y
        return
    }
    if (ctx.c === 'H') {
        ctx.t[1] += ctx.x
        return
    }
    for (let j = 1; j < ctx.t.length; j += 2) {
        ctx.t[j] += ctx.x
        ctx.t[j + 1] += ctx.y
    }
}

function parseSegments(d: string): (string | number)[][] {
    // replace all terms with space + term to remove garbage
    // replace command letters with an additional space
    // remove spaces around
    // split on double-space (splits on command segment)
    // parse each segment into an of list of command + args
    return d
        .replace(/[\^\s]*([mhvlzcsqta]|[-]?[\d]*[.]?[\d]+)[\$\s]*/gi, ' $1')
        .replace(/([mhvlzcsqta])/gi, ' $1')
        .trim()
        .split('  ')
        .map(parseSegment)
}

function parseSegment(s2: string): (string | number)[] {
    // split command segment into command + args
    return s2.split(' ').map(parseCommand)
}

function parseCommand(str: string, i: number): string | number {
    // convert all terms except command into a number
    return i === 0 ? str : +str
}
