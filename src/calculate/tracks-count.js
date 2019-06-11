class TracksCount {
  constructor(node, properties) {
    this.node = node;
    this.properties = properties;
  }

  /*
   * calculate a number of grid trancks.
   * Attention: the number contains the track extended by the child element.
   */
  calculate() {
    return {
      columns: this.calculateTotalNumberOfColumns(),
      rows: this.calculateTotalNumberOfRows(),
    };
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
}

export default TracksCount;