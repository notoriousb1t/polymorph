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
