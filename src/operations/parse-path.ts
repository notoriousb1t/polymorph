import { _, Z, T, Q, S, C, V, H } from '../constants'
import { coalesce } from '../utilities/coalesce'

// for parsing poly-commands
const argLengths = { M: 2, H: 1, V: 1, L: 2, Z: 0, C: 6, S: 4, Q: 4, T: 2 }

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
    addSegment(ctx, n[0], n[1])
}
function h(ctx: IParseContext): void {
    addCurve(ctx, _, _, _, _, ctx.t[0], _)
}
function v(ctx: IParseContext): void {
    addCurve(ctx, _, _, _, _, _, ctx.t[0])
}
function l(ctx: IParseContext): void {
    const n = ctx.t
    addCurve(ctx, _, _, _, _, n[0], n[1])
}
function z(ctx: IParseContext): void {
    addCurve(ctx, _, _, _, _, ctx.p[0], ctx.p[1])
}
function c(ctx: IParseContext): void {
    const n = ctx.t
    addCurve(ctx, n[0], n[1], n[2], n[3], n[4], n[5])

    // set last control point for subsequence C/S
    ctx.cx = n[0]
    ctx.cy = n[1]
}
function s(ctx: IParseContext): void {
    const n = ctx.t
    const isInitialCurve = ctx.lc !== S && ctx.lc !== C
    const x1 = isInitialCurve ? _ : ctx.x * 2 - ctx.cx
    const y1 = isInitialCurve ? _ : ctx.y * 2 - ctx.cy

    addCurve(ctx, x1, y1, n[0], n[1], n[2], n[3])

    // set last control point for subsequence C/S
    ctx.cx = n[0]
    ctx.cy = n[1]
}
function q(ctx: IParseContext): void {
    const n = ctx.t
    const cx1 = n[0]
    const cy1 = n[1]
    const dx = n[2]
    const dy = n[3]

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
    const dx = n[0]
    const dy = n[1]

    let x1: number, y1: number, x2: number, y2: number
    if (ctx.lc === Q || ctx.lc === T) {
        const cx1 = ctx.x * 2 - ctx.cx
        const cy1 = ctx.y * 2 - ctx.cy
        x1 = ctx.x + (cx1 - ctx.x) * quadraticRatio
        y1 = ctx.y + (cy1 - ctx.y) * quadraticRatio
        x2 = dx + (cx1 - dx) * quadraticRatio
        y2 = dy + (cy1 - dy) * quadraticRatio
    } else {
        x1 = x2 = ctx.x
        y1 = y2 = ctx.y
    }

    addCurve(ctx, x1, y1, x2, y2, dx, dy)

    ctx.cx = x2
    ctx.cy = y2
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
        const isRelative = command !== Z && command !== commandLetter

        // set command on context
        ctx.c = command

        // find command parser
        const parser = parsers[command]
        const maxLength = argLengths[command]
        if (!parser) {
            throw new Error(ctx.c + ' is not supported')
        }

        const t2 = terms as number[]
        let k = 1
        do {
            // split this segment into a subsegment
            ctx.t = t2.slice(k, k + maxLength)

            // convert to absolute if necessary
            if (isRelative) {
                convertToAbsolute(ctx)
            }
            // parse
            parser(ctx)
            k += maxLength
        } while (k < t2.length)
    }

    // return points
    return ctx.s
}

function convertToAbsolute(ctx: IParseContext): void {
    if (ctx.c === V) {
        ctx.t[0] += ctx.y
    } else if (ctx.c === H) {
        ctx.t[0] += ctx.x
    } else {
        for (let j = 0; j < ctx.t.length; j += 2) {
            ctx.t[j] += ctx.x
            ctx.t[j + 1] += ctx.y
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
        .replace(/[\^\s]?([mhvlzcsqta]|\-?\d*\.?\d+)[,\$\s]?/gi, ' $1')
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
