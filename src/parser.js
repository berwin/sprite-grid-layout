class Parser {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
  }

  parse() {}

  /*
   * Parser Grid container
   * @retrun Grid Matrix
   */
  parseGridContainer() {}

  /*
   * Parser Grid item
   */
  parseGridItem() {}

  parseGridTemplateRows() {}

  parseGridTemplateColumns() {}
}

export default Parser;