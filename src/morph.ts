import { morphPath } from './operators/morphPath'
import { parse } from './parse'
import { IPathElement } from './types'

/**
 * Returns a function to interpolate between the two path shapes.
 * @param left path data, CSS selector, or path element
 * @param right path data, CSS selector, or path element
 */
export function morph(left: string | IPathElement, right: string | IPathElement): (offset: number) => string {
    return morphPath(parse(left), parse(right))
}
