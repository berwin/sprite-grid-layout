import test from 'ava';
import {Node} from '../lib';

const container = Node.create({
  width: 500,
  height: 300,
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto 1fr auto',
});

const title = Node.create({
  width: 100,
  height: 25,
  gridColumn: '1',
  gridRow: '1',
});

const score = Node.create({
  width: 100,
  height: 25,
  gridColumn: '1',
  gridRow: '3',
});

const stats = Node.create({
  gridColumn: '1',
  gridRow: '2',
  height: 250,
  width: 100,
});

const board = Node.create({
  gridColumn: '2',
  gridRow: '1 / span 2',
  width: 400,
  height: 275,
});

const controls = Node.create({
  gridColumn: '2',
  gridRow: '3',
  width: 400,
  height: 25,
});

container.appendChild(title);
container.appendChild(score);
container.appendChild(stats);
container.appendChild(board);
container.appendChild(controls);

/*
{
  left: 0,
  top: 0,
  width: 500,
  height: 500,
  children: [
    { left: 0, top: 0 },
    { left: 0, top: 275 },
    { left: 0, top: 25 },
    { left: 100, top: 0 },
    { left: 100, top: 275 },
  ]
}
*/

test('Basic Grid Layout', (t) => {
  container.calculateLayout();
  const layout = container.getAllComputedLayout();
  const expected = [
    {left: 0, top: 0},
    {left: 0, top: 275},
    {left: 0, top: 25},
    {left: 100, top: 0},
    {left: 100, top: 275},
  ];
  t.deepEqual(layout, expected);
});
