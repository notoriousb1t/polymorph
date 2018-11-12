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

export interface IAnimateOptions extends IMixOptions {
    target: Element | string;
    duration: number;
    easing?: (o: number) => number;
}

export interface IMixOptions {
    fromPath: string | IPathElement;
    toPath: string | IPathElement;

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
