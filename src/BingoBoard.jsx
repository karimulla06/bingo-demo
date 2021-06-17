import React from 'react';
import { useLocalState } from './useLocalState';
import './style.css';

const generateRandomArray = size => {
  return [...Array(size + 1).keys()].splice(1).sort(() => 0.5 - Math.random());
};

// const h = {
//   0: [0, 1, 2, 3, 4],
//   1: [5, 6, 7, 8, 9],
//   2: [10, 11, 12, 13, 14],
//   3: [15, 16, 17, 18, 19],
//   4: [20, 21, 22, 23, 24]
// };
// const v = {
//   0: [0, 5, 10, 15, 20],
//   1: [1, 6, 11, 16, 21],
//   2: [2, 7, 12, 17, 22],
//   3: [3, 8, 13, 18, 23],
//   4: [4, 9, 14, 19, 24]
// };
// const d = {
//   0: [0, 6, 12, 18, 24],
//   1: [4, 8, 12, 16, 20]
// };
const h = {
  0: 5,
  1: 5,
  2: 5,
  3: 5,
  4: 5
};
const v = {
  0: 5,
  1: 5,
  2: 5,
  3: 5,
  4: 5
};
const d = {
  0: 5,
  1: 5
};

const getLinesToCheck = (key, size) => {
  const q = Math.floor(key / size);
  const r = Math.floor(key % size);
  console.log(key, h, v, d, q, r);
  if (q === r) {
    return [--h[q], --v[r], --d[0]];
  } else if (q + r === size - 1) {
    return [--h[q], --v[r], --d[1]];
  }
  return [--h[q], --v[r]];
};

export default function BingoBoard({ size = 5 }) {
  const [randomArray, setRandomArray] = useLocalState('bingo', () =>
    generateRandomArray(size * size)
  );

  const [selected, setSelected] = useLocalState('bingo-selected', []);
  const [canUndo, setCanUndo] = useLocalState('bingo-undo', false);

  const handleClick = (key, index) => {
    if (!selected.includes(key)) {
      console.log(key, index);
      const newSelected = [...selected, key];
      setSelected(newSelected);
      setCanUndo(true);
      console.log(getLinesToCheck(index, size));
    }
  };
  const handleUndo = () => {
    setSelected(arr => arr.slice(0, -1));
    setCanUndo(false);
  };
  const handleNewGame = () => {
    setRandomArray(generateRandomArray(size * size));
    setSelected([]);
    setCanUndo(false);
  };

  const getCell = key => {
    const cellProps = {
      className: 'bingo-box',
      onClick: () => handleClick(key),
      style: {
        backgroundColor: selected.includes(key) && 'cyan'
      }
    };
    return (
      <div {...cellProps} key={key}>
        {key}
      </div>
    );
  };
  return (
    <div className="game-area">
      <h2 className="title">B I N G O</h2>
      <div className="bingo-grid" style={{ width: `${size * 10}vw` }}>
        {randomArray.map((key, index) => getCell(key, index))}
      </div>
      <div className="buttons-container" style={{ width: `${size * 10}vw` }}>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="bingo-button"
        >
          Undo
        </button>
        <button onClick={handleNewGame} className="bingo-button">
          New Game
        </button>
      </div>
    </div>
  );
}
