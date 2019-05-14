class Compose {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
  }

  compose() {
    return {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    };
  }
}

export default Compose;