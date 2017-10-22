import { IPathSegment } from '../types';

export function reverse(segment: IPathSegment): IPathSegment {
  return {
    d: segment.d,
    h: segment.h,
    w: segment.w,
    x: segment.x,
    y: segment.y
  }
}
