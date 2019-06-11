class Position {
  constructor(trackSize, children) {
    this.trackSize = trackSize;
    this.children = children;
  }

  calculate() {
    const positions = this.children.map(this.calculatePosition.bind(this));
  }

  calculatePosition(node) {
    const {
      gridColumnStart,
      gridColumnEnd,
      gridRowStart,
      gridRowEnd,
    } = node.computedProperties;
    console.log(gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd);
  }

  calculatePositionX() {}
  calculatePositionY() {}
}

export default Position;