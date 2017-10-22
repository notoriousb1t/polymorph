import { parsePath } from './operators/parsePath'
import { getPath } from './getPath';
import { IPathElement, IPath } from './types'

/**
 * Parses the path data and returns a model describing it
 * @param d Path Data, A path element, or a selector for a path element
 */
export function parse(d: string | IPathElement): IPath {
    return parsePath(getPath(d))
}

