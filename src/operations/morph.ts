import { mix } from './mix'
import { parse } from './parse'

/**
 * Returns a function to interpolate between the two path shapes.
 * @param left path data, CSS selector, or path element
 * @param right path data, CSS selector, or path element
 */
export function morph(
    left: string | { tagName: string },
    right: string | { tagName: string }
): (offset: number) => string {
    return mix(parse(left), parse(right))
}
