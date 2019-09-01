import { raiseError } from './utilities/errors';
import { FloatArray } from './types';
import { parsePoints } from './operators/parsePoints';
import { _ } from './constants';

const selectorRegex = /^([#|\.]|path)/i;

export type IPathSource = string | SupportedElement;
type SupportedElement = SVGPathElement;

/**
 * This function figures out what kind of source the path is coming from and converts
 * it to the appropriate array representation.
 * @param pathSource The source of the path. This can be string path data, a path
 *     element, or a string containing an HTML selector to a path element.
 */
export function convertToPathData(pathSource: FloatArray[] | IPathSource): IPathData {
  if (Array.isArray(pathSource)) {
    return { data: pathSource, stringData: _ }
  }
  let stringData: string | undefined;
  if (typeof pathSource === 'string' && selectorRegex.test(pathSource)) {
    pathSource = document.querySelector(pathSource) as SupportedElement;
  } else {
    stringData = pathSource as string;
  }
  if (typeof pathSource === 'string') {
    // at this point, it should be path data.
    return { data: parsePoints(pathSource), stringData };
  }

  const pathElement = pathSource as SupportedElement;
  if (pathElement instanceof SVGPathElement) {
    // path's can be converted to path data by reading the d property.
    stringData = pathElement.getAttribute('d');
    return { data: parsePoints(stringData), stringData };
  }
  // in case a non-supported element is passed, throw an error.
  return raiseError('Unsupported element ', (pathElement as Element).tagName);
}

export interface IPathData {
  data: FloatArray[];
  stringData: string | undefined;
}
