import {isUndef} from '../util';

/**
 * Resolves automatic positions of grid items into definite positions,
 * ensuring that every grid item has a well-defined grid area to layout into.
 */
class Placement {
  constructor(matrix, children) {
    this.matrix = matrix;
    this.children = children;
    this.placementAlgorithm(this.children);
  }

  placementAlgorithm(children) {
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
}

export default Placement;