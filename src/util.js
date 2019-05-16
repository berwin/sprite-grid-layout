export function isDef(v) {
  return v !== undefined && v !== null;
}

export const hasSpan = str => str && (str.indexOf('span') >= 0);
