import {isRoot} from '../util';
import TracksCount from './tracks-count';
import Placement from './placement';
import TrackSize from './tracks-size';
import Position from './position';

class Calculate {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
    this.init();
  }

  init() {
    if(isRoot(this.node)) {
      this.calculateTracksCount();
      this.initMatrix();
      this.gridItemPlacementAlgorithm();
      this.calculateTracksSize();
      this.calculatePositions();
      console.log(this.positions);
    }
  }

  /**
   * calculate a number of grid trancks.
   * Attention: the number contains the track extended by the child element.
   * Example:
   * {
   *   columns: n,
   *   rows: n,
   * }
   */
  calculateTracksCount() {
    this.tracksCount = new TracksCount(this.node, this.properties).calculate();
  }

  initMatrix() {
    const x = this.tracksCount.rows;
    const y = this.tracksCount.columns;
    this.matrix = this.createMatrix(x, y);
  }

  /*
   * Create empty matrices
   */
  createMatrix(x, y) {
    const matrix = [];
    while(x--) {
      matrix.push(new Array(y));
    }
    return matrix;
  }

  /*
   * Resolves automatic positions of grid items into definite positions,
   * ensuring that every grid item has a well-defined grid area to layout into.
   */
  gridItemPlacementAlgorithm() {
    new Placement(this.matrix, this.node.children);
  }

  /*
   * @param {string[]} ['auto', '1fr'], - Grid track-list value
   * @param {number[]} [200, 800], - Grid track-list value
   * @returns {string[]} True track size, list this: ['200', '800']
   */
  calculateTracksSize() {
    this.trackSize = new TrackSize(this.node, this.matrix).calculate();
  }

  calculatePositions() {
    this.positions = new Position(this.trackSize, this.node.children).calculate();
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
      width: this.properties.width,
      height: this.properties.height,
      left: 0,
      top: 0,
    };
  }
}

export default Calculate;