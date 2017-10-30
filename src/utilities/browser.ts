/**
 * This file does browser sniffing (oh no!) to figure out if this is Internet Explorer or Edge
 */

// tslint:disable-next-line:no-var-keyword
var userAgent = typeof window !== 'undefined' && window.navigator.userAgent
export const isEdge = /(MSIE |Trident\/|Edge\/)/i.test(userAgent)
