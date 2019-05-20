class Calculate {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
  }

  /*
   * {
   *   gridTemplateColumns: ['auto', '1fr'],
   *   gridTemplateRows: ['auto', '1fr', 'auto']
   * }
   * To:
   * {
   *   gridTemplateColumns: ['200', '800'],
   *   gridTemplateRows: ['150', '800', '50']
   * }
   * To:
   * [
   *   [{width: '200', height: '150', name: '?'}, {width: '800', height: '150', name: '?'}],
   *   [{width: '200', height: '800', name: '?'}, {width: '800', height: '800', name: '?'}],
   *   [{width: '200', height: '50', name: '?'}, {width: '800', height: '50', name: '?'}]
   * ]
   */
  run() {
    return {
      ...this.calculateSize(this.properties),
      left: 0,
      top: 0,
    };
  }

  calculateSize(properties) {
    return {
      width: properties.width,
      height: properties.height,
    };
  }
}

export default Calculate;