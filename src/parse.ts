import { parsePath } from './operators/parsePath'
import { getPath } from './getPath';
import { IPathSegment, IPathElement } from './types'

/**
 * Parses the path data and returns a model describing it
 * @param d Path Data, A path element, or a selector for a path element
 */
export function parse(d: string | IPathElement): IPathSegment[] {
    return parsePath(getPath(d))
}

