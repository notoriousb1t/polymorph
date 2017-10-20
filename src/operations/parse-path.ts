import { _, S, C, Z } from '../constants'
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

const parsers = {
    M(ctx: IParseContext): void {
        const n = ctx.t
        addSegment(ctx, n[1], n[2])
    },
    H(ctx: IParseContext): void {
        addCurve(ctx, _, _, _, _, ctx.t[1], _)
    },
    V(ctx: IParseContext): void {
        addCurve(ctx, _, _, _, _, _, ctx.t[1])
    },
    L(ctx: IParseContext): void {
        const n = ctx.t
        addCurve(ctx, _, _, _, _, n[1], n[2])
    },
    Z(ctx: IParseContext): void {
        addCurve(ctx, _, _, _, _, ctx.p[0], ctx.p[1])
    },
    C(ctx: IParseContext): void {
        const n = ctx.t
        addCurve(ctx, n[1], n[2], n[3], n[4], n[5], n[6])
    },
    S(ctx: IParseContext): void {
        const t = ctx.t
        const p = ctx.p
        const isLastCurve = ctx.lc === S || ctx.lc === C

        let x1: number = _
        let y1: number = _
        if (isLastCurve) {
            const len = p.length
            x1 = p[len - 2] * 2 - p[len - 4]
            y1 = p[len - 1] * 2 - p[len - 3]
        }

        addCurve(ctx, x1, y1, t[1], t[2], t[3], t[4])
    },
    Q(ctx: IParseContext): void {
        const n = ctx.t
        addCurve(ctx, n[1], n[2], n[1], n[2], n[3], n[4])
    }
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

function parseCommand(s: string, i: number): string | number {
    // convert all terms except command into a number
    return i === 0 ? s : +s
}
