import {isDef} from './util';

class Parser {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
  }

  /*
   * Parse Grid Properties, Like this:
   * {
   *   grid-template-columns: auto 1fr;
   *   grid-template-rows:auto 1fr auto;
   * }
   * To:
   * {
   *   gridTemplateColumns: ['auto', '1fr'],
   *   gridTemplateRows: ['auto', '1fr', 'auto']
   * }
   */
  parse() {
    const properties = {
      ...this.parsePublicProperties(this.properties),
      ...this.parseGridContainer(this.properties),
      ...this.parseGridItem(this.properties),
    };
    return Object.fromEntries(
      Object.entries(properties)
        .filter(item => isDef(item[1]))
    );
  }

  parsePublicProperties(properties) {
    return {
      width: properties.width,
      height: properties.height,
    };
  }

  /*
   * Parser Grid Container properties
   */
  parseGridContainer(properties) {
    return {
      gridTemplateRows: this.parseGridTemplateRows(properties),
      gridTemplateColumns: this.parseGridTemplateColumns(properties),
    };
  }

  parseGridTemplateRows(properties) {
    const gridTemplateRows = properties.gridTemplateRows && properties.gridTemplateRows.trim();
    return gridTemplateRows
      ? gridTemplateRows.split(' ')
      : undefined;
  }

  parseGridTemplateColumns(properties) {
    const gridTemplateColumns = properties.gridTemplateColumns && properties.gridTemplateColumns.trim();
    return gridTemplateColumns
      ? gridTemplateColumns.split(' ')
      : undefined;
  }

  /*
   * Parser Grid item properties
   */
  parseGridItem(properties) {
    return {
      gridColumn: this.parseGridColumn(properties),
      gridRow: this.parseGridRow(properties),
    };
  }

  parseGridColumn(properties) {
    const columnSpan = 1; // grid span default is 1
    return {
      gridColumnStart: 1,
      gridColumnEnd: 1,
      columnSpan,
    };
  }

  parseGridRow(properties) {
    const rowSpan = 1; // grid span default is 1
    return {
      gridRowStart: 1,
      griRowEnd: 1,
      rowSpan,
    };
  }
}

export default Parser;