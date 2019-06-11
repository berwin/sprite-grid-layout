class Position {
  constructor(trackSize, children) {
    this.trackSize = trackSize;
    this.children = children;
  }

  calculate() {
    return this.children.map(this.calculatePosition.bind(this));
  }

  calculatePosition(node) {
    const {gridColumnStart, gridRowStart} = node.computedProperties;
    const left = this.position(gridColumnStart, this.trackSize.columns);
    const top = this.position(gridRowStart, this.trackSize.rows);
    return {left, top};
  }

  position(startLine, lines) {
    // Because the number of tracks is one less than the number of grid lines.
    const gridLine = startLine - 1;
    return lines.slice(0, gridLine).reduce((pre, cur) => (pre + cur), 0);
  }
}

export default Position;