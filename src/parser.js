import {isDef, hasSpan} from './util';

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
      ...this.parseGridItems(this.properties),
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
      gridTemplateRows: this.parseGridTemplateRows(properties.gridTemplateRows),
      gridTemplateColumns: this.parseGridTemplateColumns(properties.gridTemplateColumns),
    };
  }

  parseGridTemplateRows(gridTemplateRows) {
    if(!gridTemplateRows) return null;
    // eslint-disable-next-line
    return (gridTemplateRows = gridTemplateRows.trim())
      ? gridTemplateRows.split(' ')
      : null;
  }

  parseGridTemplateColumns(gridTemplateColumns) {
    if(!gridTemplateColumns) return null;
    // eslint-disable-next-line
    return (gridTemplateColumns = gridTemplateColumns.trim())
      ? gridTemplateColumns.split(' ')
      : null;
  }

  /*
   * Parser Grid items properties
   */
  parseGridItems(properties) {
    return {
      ...this.parseGridColumn(properties.gridColumn),
      ...this.parseGridRow(properties.gridRow),
    };
  }

  parseGridColumn(gridColumn) {
    const {start, end} = this.parseItemsShorthands(gridColumn);
    return {
      gridColumnStart: start,
      gridColumnEnd: end,
    };
  }

  parseGridRow(gridRow) {
    const {start, end} = this.parseItemsShorthands(gridRow);
    return {
      gridRowStart: start,
      gridRowEnd: end,
    };
  }

  /*
   * The value to be parsed is: <grid-line> [ / <grid-line> ]?
   */
  parseItemsShorthands(value) {
    if(!value) return {};

    const defaultSpan = 1; // grid span default is 1
    const values = value.split('/').slice(0, 2);

    const startLine = this.getGridItemLine(values[0]);
    const startSpan = hasSpan(values[0]);
    const endLine = this.getGridItemLine(values[1]);
    const endSpan = hasSpan(values[1]);
    const columnEndLine = endSpan ? (startLine + endLine) : endLine;

    return {
      start: startSpan ? (endLine - startLine) : startLine,
      end: columnEndLine || (startLine + defaultSpan),
    };
  }

  getGridItemLine(str) {
    const matched = str && str.match(/[0-9]+/);
    return matched
      ? Number(matched[0])
      : null;
  }
}

export default Parser;