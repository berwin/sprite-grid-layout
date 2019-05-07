import test from 'ava';
import {Node} from '../lib';

const container = Node.create({});

const node1 = Node.create({
  width: 100,
  height: 100,
});

const node2 = Node.create({
  width: 100,
  height: 100,
});

container.appendChild(node1);
container.appendChild(node2);

container.calculateLayout();
const layout = container.getAllComputedLayout();
// eslint-disable-next-line
console.log(`Test output: ${layout}`);

test('foo', (t) => {
  t.pass();
});
