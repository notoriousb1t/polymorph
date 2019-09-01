export type Matrix = [FloatArray[], FloatArray[]]
export type Func<T1, T2> = (input: T1) => T2;

export interface IRenderer<T> {
    (offset: number): T
}

export interface IPath {
    path: string
    data: FloatArray[]
}

export type IMorphable = string | SVGPathElement;

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
    segments: FloatArray[]
    /**
     * Current poly-bezier. (The one being bult)
     */
    current?: number[]
}

// tslint:disable-next-line:interface-name
export interface InterpolateOptions {
    /**
     * Origin of the shape
     */
    origin?: IOrigin
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

export interface IOrigin {
  /**
   * The y position
   */
  x: number
  /**
   * The x position
   */
  y: number
  /**
   * If true, x and y are absolute coordinates in the SVG.
   * If false, x and y are a number between 0 and 1 representing 0% to 100% of the matched subpath
   */
  absolute?: boolean
}
