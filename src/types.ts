export type Matrix = [FloatArray[], FloatArray[]]
export type Func<T1, T2> = (input: T1) => T2;

export interface IRenderer<T> {
    (offset: number): T
}

export interface IPath {
    path: string
    data: IPathSegment[]
}

/**
 * Internal representation of Path data
 */
export interface IPathSegment {
    /**
     * Path data
     */
    d: FloatArray
    /**
     * Approximate box width
     */
    w: number
    /**
     * Approximate box height
     */
    h: number
    /**
     * Approximate x for upper left corner
     */
    x: number
    /**
     * Approximate y for upper left corner
     */
    y: number
    /**
     * Approximate perimeter
     */
    p: number
}

export interface IPathElement {
    tagName: 'PATH'
}

/**
 * Used to keep track of the current state of the path/point parser
 */
export interface IParseContext {
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
    cx?: number
    /**
     * Last Control Y
     */
    cy?: number
    /**
     * Last command that was seen
     */
    lc?: string
    /**
     * Current command being parsed
     */
    c?: string
    /**
     * Terms being parsed
     */
    t?: FloatArray
    /**
     * All segments
     */
    s: FloatArray[]
    /**
     * Current poly-bezier. (The one being bult)
     */
    p?: number[]
}

export interface InterpolateOptions {
    /**
     * Origin of the shape
     */
    origin?: { x: number, y: number }
    /**
     * The wind (like a clock) direction of the path.
     *  - none: will leave the path as is.
     *  - clockwise: (default) will change all subpaths to draw clockwise.
     *  - counter-clockwise: will change all paths to draw counter-clockwise.
     */
    wind?: 'none' | 'clockwise' | 'counter-clockwise'
    /**
     * Determines the strategy to optimize two paths for each other.
     *
     * - none: use when both shapes have an equal number of subpaths and points
     * - fill: (default) creates subpaths and adds points to align both paths
     */
    optimize?: 'none' | 'fill'

    /**
     * Number of points to add when using optimize: fill.  The default is 0.
     */
    addPoints?: number

    /**
     * Number of decimal places to use when rendering 'd' strings.
     * For most animations, 0 is recommended.  If very small shapes are being used, this can be increased to
     * improve smoothness at the cost of (browser) rendering speed
     * The default is 0 (no decimal places) and also the recommended value.
     */
    precision?: number
}

// tslint:disable-next-line:interface-name
export interface FloatArray {
    length: number
    [index: number]: number
    slice(startIndex: number): FloatArray;
}

export interface IFloatArrayConstructor {
    new (count: number): FloatArray
}
