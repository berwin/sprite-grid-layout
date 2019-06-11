import {isNumber} from '../util';

class TrackSize {
  constructor(node, matrix) {
    this.node = node;
    this.matrix = matrix;
  }

  /*
   * @param {string[]} ['auto', '1fr'], - Grid track-list value
   * @param {number[]} [200, 800], - Grid track-list value
   * @returns {string[]} True track size, list this: ['200', '800']
   */
  calculate() {
    const properties = this.node.computedProperties;
    const rows = properties.gridTemplateRows;
    const columns = properties.gridTemplateColumns;
    const width = properties.width;
    const height = properties.height;
    return {
      rows: this.calculateTrackSize(height, rows, 'row'),
      columns: this.calculateTrackSize(width, columns, 'column'),
    };
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

export default TrackSize;