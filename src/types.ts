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
  d: number[]
  /**
   * Approximate box width
   */
  w: number;
  /**
   * Approximate box height
   */
  h: number;
  /**
   * Approximate x position (left)
   */
  x: number;
  /**
   * Approximate y position (upper)
   */
  y: number;
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
