import React from 'react';
import { useLocalState } from './useLocalState';
import './style.css';

const generateRandomArray = size => {
  return [...Array(size + 1).keys()].splice(1).sort(() => 0.5 - Math.random());
};

const createLinesObj = size => {
  const obj = {
    h: {},
    v: {},
    d: {
      0: size,
      1: size
    }
  };
  for (let i = 0; i < size; i++) {
    obj.h[i] = size;
    obj.v[i] = size;
  }
  return obj;
};

const getCompletedLines = (index, size, obj) => {
  const { h, v, d } = obj;
  const q = Math.floor(index / size);
  const r = Math.floor(index % size);
  const d1 = q == r;
  const d2 = q + r === size - 1;
  let arr = [];

  if (d1 && d2) {
    arr = [--h[q], --v[r], --d[0], --d[1]];
  } else if (d1) {
    arr = [--h[q], --v[r], --d[0]];
  } else if (d2) {
    arr = [--h[q], --v[r], --d[1]];
  } else {
    arr = [--h[q], --v[r]];
  }
  return arr.filter(x => x === 0).length;
};

export default function BingoBoard({ size = 5 }) {
  const [randomArray, setRandomArray] = useLocalState('bingo', () =>
    generateRandomArray(size * size)
  );

  const [selected, setSelected] = useLocalState('bingo-selected', []);
  const [canUndo, setCanUndo] = useLocalState('bingo-undo', false);

  const [linesObj, setLinesObj] = useLocalState('bingo-lines', () =>
    createLinesObj(size)
  );

  const handleClick = (key, index) => {
    if (!selected.includes(key)) {
      const newSelected = [...selected, key];
      setSelected(newSelected);
      setCanUndo(true);
      console.log(getCompletedLines(index, size, linesObj));
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
    setLinesObj(createLinesObj(size));
  };

  const getCell = (key, index) => {
    const cellProps = {
      className: 'bingo-box',
      onClick: () => handleClick(key, index),
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
