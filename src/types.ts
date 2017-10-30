export type Matrix = [FloatArray[], FloatArray[]]

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
     * Approximate x origin
     */
    ox: number
    /**
     * Approximate y origin
     */
    oy: number
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
     * When true, this will move the starting position of all closed shapes to the upper left hand corner of the bounding box.
     */
    align?: boolean
    /**
     * The wind (like a clock) direction of the path.
     *  'preserve' will leave the path as is.  'clockwise' will change all subpaths to clockwise.  'counter-clockwise' will change all
     *  paths to counter-clockwise. The default value is 'clockwise'.
     */
    wind?: 'preserve' | 'clockwise' | 'counter-clockwise'
    /**
     * Determines what strategy should be used for filling additional subpaths and when the number of points do not line up.
     * 'preserve' assumes everything lines up, 'insert' will attempt to correct this by inserting empty subpaths and net0 points.
     * The default value is 'insert'
     */
    fillStrategy?: 'preserve' | 'insert'

    /**
     * Number of points to add to each sub-path.  This can be used for smoothing out shapes.  The default is 5
     */
    addPoints?: number
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
