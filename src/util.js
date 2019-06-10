const toString = Object.prototype.toString;

export function isDef(s) {
  return s !== undefined && s !== null;
}

export function isUndef(s) {
  return s === undefined || s === null;
}

export function isNumber(n) {
  return toString.call(n) === '[object Number]';
}

export const hasSpan = str => str && (str.indexOf('span') >= 0);

export function isRoot(node) {
  return node.properties.gridTemplateColumns || node.properties.gridTemplateRows;
}
