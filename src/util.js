export function isDef(s) {
  return s !== undefined && s !== null;
}

export function isUndef(s) {
  return s === undefined || s === null;
}

export const hasSpan = str => str && (str.indexOf('span') >= 0);

export function isRoot(node) {
  return node.properties.gridTemplateColumns || node.properties.gridTemplateRows;
}
