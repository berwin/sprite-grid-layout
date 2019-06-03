import Parser from './parser';
import Calculate from './calculate';

let id = 1;

export class Node {
  constructor(properties) {
    this.parent = null;
    this.children = [];
    this.id = id++;
    this.properties = properties;
    this.computedProperties = {};
    this.computedValues = {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    };
  }

  static create(config = Object.create(null)) {
    return new Node(config);
  }

  static GridProperties = [
    'height',
    'width',
    'gridTemplateRows',
    'gridTemplateColumns',
    'gridColumn',
    'gridRow',
  ]

  appendChild(child) {
    if(!(child instanceof Node)) {
      throw new Error('appended Child must be instance of Node');
    }
    child.parent = this;
    this.children.push(child);
    return this;
  }

  calculateLayout(node) {
    if(!node) node = this;
    // The parser first
    node.computedProperties = new Parser(node, node.properties).parse();
    node.children.map(child => child.calculateLayout(child));

    // And then calculate the value
    node.computedValues = new Calculate(node, node.computedProperties).run();
  }

  getAllComputedLayout() {
    const layout = this.computedValues;
    layout.children = this.children.map(child => child.computedValues);
    return layout;
  }
}

export default Node;
