export class Node {
  constructor(config) {
    console.error(config);
  }

  static create(config) {
    return new Node(config);
  }

  create() {}

  appendChild() {}

  calculateLayout() {}

  getAllComputedLayout() {}
}

export default Node;
