import {isRoot, isUndef, isNumber} from './util';

class Calculate {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
    this.init();
  }

  init() {
    if(isRoot(this.node)) {
      this.calculateNumberOfTracks();
      this.initMatrix();
      this.gridItemPlacementAlgorithm(this.node.children);
      this.calculateTracksSize();
    }
  }

  /*
   * calculate a number of grid trancks.
   * Attention: the number contains the track extended by the child element.
   */
  calculateNumberOfTracks() {
    // this.columnTracks = this.calculateTotalNumberOfColumns();
    // this.rowTracks = this.calculateTotalNumberOfRows();
    this.numberOfColumns = this.calculateTotalNumberOfColumns();
    this.numberOfRows = this.calculateTotalNumberOfRows();
  }

  calculateTotalNumberOfColumns() {
    const number = this.properties.gridTemplateColumns.length;
    return this.calculateTotalNumberOfTracks(number, 'gridColumnEnd');
  }

  calculateTotalNumberOfRows() {
    const number = this.properties.gridTemplateRows.length;
    return this.calculateTotalNumberOfTracks(number, 'gridRowEnd');
  }

  calculateTotalNumberOfTracks(minimum, gridEnd) {
    let tracks = minimum || 0;
    const children = this.node.children;
    for(const node of children) {
      const line = node.computedProperties[gridEnd];
      // Because the number of tracks is one less than the number of grid lines.
      const newTracks = line - 1;
      if(newTracks > tracks) tracks = newTracks;
    }
    return tracks;
  }

  initMatrix() {
    const x = this.numberOfRows;
    const y = this.numberOfColumns;
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

    this.placementItemsInMatrix(items);
    this.placementAnonymousItemsInMatrix(anonymousItems);
  }

  placementItemsInMatrix(items) {
    for(const item of items) {
      const property = item.computedProperties;
      const rowStart = property.gridRowStart;
      const rowEnd = property.gridRowEnd;
      const colStart = property.gridColumnStart;
      const colEnd = property.gridColumnEnd;

      for(let x = rowStart; x < rowEnd; x++) {
        for(let y = colStart; y < colEnd; y++) {
          // Because the number of tracks is one less than the number of grid lines.
          this.matrix[x - 1][y - 1] = item;
        }
      }
    }
  }

  placementAnonymousItemsInMatrix(items) {
    if(!items.length) return;
    const anonymousItems = items.slice();
    const matrix = this.matrix;
    for(const rowTracks of matrix) {
      for(const [key, cell] of rowTracks.entries()) {
        if(isUndef(cell)) {
          rowTracks[key] = anonymousItems.shift();
          if(!anonymousItems.length) return;
        }
      }
    }
  }

  /*
   * @param {string[]} ['auto', '1fr'], - Grid track-list value
   * @param {number[]} [200, 800], - Grid track-list value
   * @returns {string[]} True track size, list this: ['200', '800']
   */
  calculateTracksSize() {
    const properties = this.node.computedProperties;
    const rows = properties.gridTemplateRows;
    const columns = properties.gridTemplateColumns;
    const width = properties.width;
    const height = properties.height;
    this.rowTracks = this.calculateTrackSize(height, rows, 'row');
    this.columnTracks = this.calculateTrackSize(width, columns, 'column');
    console.log('---->', this.rowTracks, this.columnTracks);
  }

  calculateTrackSize(totalSize, trackList, direction) {
    const result = trackList.slice();
    for(const [key, track] of result.entries()) {
      this.calculateTrackSizeByPx(result, key, track);
      this.calculateTrackSizeByPercentage(result, key, track, totalSize);
      this.calculateTrackSizeByAuto(result, key, track, direction, this.matrix);
    }
    this.calculateTrackSizeByFr(totalSize, result);
    return result;
  }

  calculateTrackSizeByPx(result, i, track) {
    const px = /([0-9]+)px/;
    const sizeByPx = track.match(px);
    if(!sizeByPx) return;
    result[i] = sizeByPx[1];
  }

  calculateTrackSizeByPercentage(result, i, track, totalSize) {
    const percentage = /([0-9]+)%/;
    const sizeByPercentage = track.match(percentage);
    if(!sizeByPercentage) return;
    result[i] = (sizeByPercentage[1] / 100) * totalSize;
  }

  calculateTrackSizeByAuto(result, i, track, direction, matrix) {
    const auto = /(auto)/;
    const sizeByAuto = track.match(auto);
    if(!sizeByAuto) return;
    result[i] = direction === 'row'
      ? this.calculateRowTrackSizeByAuto(matrix, i)
      : this.calculateColumnTrackSizeByAuto(matrix, i);
  }

  calculateRowTrackSizeByAuto(matrix, n) {
    let maxSize = 0;
    for(const cell of matrix[n]) {
      const property = cell.computedProperties;
      const height = (property.gridRowEnd - property.gridRowStart) > 1
        ? 0
        : cell.computedProperties.height;
      if(height > maxSize) maxSize = height;
    }
    return maxSize;
  }

  calculateColumnTrackSizeByAuto(matrix, n) {
    let maxSize = 0;
    for(let i = 0; i < matrix.length; i++) {
      const cell = matrix[i][n];
      const property = cell.computedProperties;
      const width = (property.gridColumnEnd - property.gridColumnStart) > 1
        ? 0
        : cell.computedProperties.width;
      if(width > maxSize) maxSize = width;
    }
    return maxSize;
  }

  calculateTrackSizeByFr(totalSize, trancks) {
    const fr = /([0-9]+)fr/;
    let units = 0;
    let fillSpace = 0;

    for(const track of trancks) {
      if(isNumber(track)) {
        fillSpace += track;
      } else {
        const unit = track.match(fr);
        if(unit) {
          units += unit[1];
        }
      }
    }

    const leftoverSpace = totalSize - fillSpace;
    const unitSize = leftoverSpace / units;

    for(const [key, track] of trancks.entries()) {
      // eslint-disable-next-line no-continue
      if(isNumber(track)) continue;
      const unit = track.match(fr);
      if(unit) {
        trancks[key] = unitSize * unit[1];
      }
    }
  }
}

export default Calculate;