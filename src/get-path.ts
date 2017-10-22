const selectorRegex = /^([#|\.]|path)/i;

/**
 * Resolves path data and returns it
 * @param selector path data, CSS selector to get path, or Path Element
 */
export function getPath(selector: any): string {
  if (isString(selector)) {
    if (!selectorRegex.test(selector)) {
      return selector;
    }
    selector = document.querySelector(selector);
  }
  return selector.getAttribute('d');
}


function isString(obj: any): boolean {
  return typeof obj === 'string'
}
