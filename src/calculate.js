import {isRoot} from './util';

class Calculate {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
    this.init();
  }

  init() {
    if(isRoot(this.node)) {
      this.initMatrix();
      this.gridItemPlacementAlgorithm(this.node.children);
    }
  }

  initMatrix() {
    const gridTemplateRows = this.properties.gridTemplateRows;
    const gridTemplateColumns = this.properties.gridTemplateColumns;
    const x = gridTemplateRows ? gridTemplateRows.length : 1;
    const y = gridTemplateColumns ? gridTemplateColumns.length : 1;
    this.matrix = this.createMatrix(x, y);
  }

  /*
   * Create empty matrices
   */
  createMatrix(x, y) {
    return new Array(x).fill(new Array(y));
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

  /*
   * {
   *   gridTemplateColumns: ['auto', '1fr'],
   *   gridTemplateRows: ['auto', '1fr', 'auto']
   * }
   * To:
   * [
   *   [{w: x, h: y}, {w: x, h: y}],
   *   [{w: x, h: y}, {w: x, h: y}],
   *   [{w: x, h: y}, {w: x, h: y}]
   * ]
   */
  calculateVirtualMatrix() {}

  /*
   * Resolves automatic positions of grid items into definite positions,
   * ensuring that every grid item has a well-defined grid area to layout into.
   */
  gridItemPlacementAlgorithm(children) {
    // placement priority
    const isAnonymousItems = item => (!item.gridColumnStart && !item.gridColumnEnd && !item.gridRowStart && !item.gridRowEnd);
    const items = children.filter(item => (!isAnonymousItems(item.computedProperties)));
    // Anonymous grid items are always auto-placed,
    // since their boxes can’t have any grid-placement properties specified.
    const anonymousItems = children.filter(item => isAnonymousItems(item.computedProperties));
  }

  /*
   * @param {string[]} ['auto', '1fr'], - Grid track-list value
   * @param {number[]} [200, 800], - Grid track-list value
   * @returns {string[]} True track size, list this: ['200', '800']
   */
  calculateTrackSize(values, sizes) {
    // const totalSize =
    // ...
  }
}

export default Calculate;