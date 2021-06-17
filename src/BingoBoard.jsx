import React from 'react';
import { useLocalState } from './useLocalState';
import './style.css';

const generateRandomArray = size => {
  return [...Array(size + 1).keys()].splice(1).sort(() => 0.5 - Math.random());
};
export default function BingoBoard({ size = 5 }) {
  const [randomArray, setRandomArray] = useLocalState('bingo', () =>
    generateRandomArray(size * size)
  );

  const [selected, setSelected] = useLocalState('bingo-selected', []);
  const [canUndo, setCanUndo] = useLocalState('bingo-undo', false);

  const handleClick = key => {
    if (!selected.includes(key)) {
      setSelected(arr => [...arr, key]);
      setCanUndo(true);
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
        {randomArray.map(key => getCell(key))}
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
