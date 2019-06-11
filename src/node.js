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

  parse(node) {
    node.computedProperties = new Parser(node, node.properties).parse();
    node.children.map(child => child.parse(child));
  }

  calculateLayout(node) {
    if(!node) node = this;
    // The parser first
    this.parse(node);

    // And then calculate the value
    node.computedValues = new Calculate(node, node.computedProperties).run();
  }

  getAllComputedLayout() {
    return this.computedValues;
  }
}

export default Node;
