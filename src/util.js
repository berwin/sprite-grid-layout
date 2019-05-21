export function isDef(v) {
  return v !== undefined && v !== null;
}

export const hasSpan = str => str && (str.indexOf('span') >= 0);

export function isRoot(node) {
  return node.properties.gridTemplateColumns || node.properties.gridTemplateRows;
}
