import React from 'react';
import { useLocalState } from './useLocalState';
import {
  generateRandomArray,
  createLinesObj,
  getCompletedStatus,
  getUndoStatus
} from './utils';
import Confetti from './Confetti';
import './bingoBoard.scss';

export default function BingoBoard() {
  const [size, setSize] = useLocalState('bingo-size', 5);
  const [randomArray, setRandomArray] = useLocalState('bingo-keys', () =>
    generateRandomArray(size * size)
  );
  const [selected, setSelected] = useLocalState('bingo-selected-keys', []);
  const [linesObj, setLinesObj] = useLocalState('bingo-lines-obj', () =>
    createLinesObj(size)
  );
  const [linesCompleted, setLinesCompleted] = useLocalState(
    'bingo-completed-lines',
    0
  );

  const boardSizes = [3, 4, 5, 6];

  const handleClick = (key, index) => {
    if (!selected.includes(key) && linesCompleted < size) {
      const newSelected = [...selected, key];
      setSelected(newSelected);

      const [completedLines, obj] = getCompletedStatus(index, size, linesObj);
      setLinesObj(JSON.parse(JSON.stringify(obj)));
      completedLines > 0 && setLinesCompleted(linesCompleted + completedLines);
    }
  };

  const handleUndo = () => {
    const lastIndex = randomArray.indexOf(selected[selected.length - 1]);
    setSelected(arr => arr.slice(0, -1));

    const [completedLines, obj] = getUndoStatus(lastIndex, size, linesObj);
    setLinesObj(JSON.parse(JSON.stringify(obj)));
    completedLines > 0 && setLinesCompleted(linesCompleted - completedLines);
  };

  const handleNewGame = size => {
    localStorage.clear();
    setRandomArray(generateRandomArray(size * size));
    setSelected([]);
    setLinesObj(createLinesObj(size));
    setLinesCompleted(0);
  };

  const handleSizeChange = size => {
    setSize(size);
    handleNewGame(size);
  };

  const getCell = (key, index) => {
    const unit = 100 / (size + 1) + 'vw';
    const cellProps = {
      className: 'bingo-box',
      onClick: () => handleClick(key, index),
      style: {
        backgroundColor: selected.includes(key) && 'cyan',
        width: unit,
        height: unit,
        lineHeight: unit
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
      <div className="bingo-grid">
        {randomArray.map((key, index) => getCell(key, index))}
      </div>
      <div className="buttons-container">
        <button
          onClick={handleUndo}
          className="bingo-button"
          disabled={selected.length === 0}
        >
          Undo
        </button>

        <label>
          Board Size:
          <select
            name="sizes"
            className="bingo-select"
            onChange={e => handleSizeChange(Number(e.target.value))}
          >
            {boardSizes.map(s => (
              <option value={s} key={s} selected={s === size && 'selected'}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => handleNewGame(size)} className="bingo-button">
          New Game
        </button>
      </div>
      {linesCompleted >= size ? (
        <div>
          <h1 className="title">You WON !!!</h1>
          <Confetti />
        </div>
      ) : (
        <h4 className="title">Lines Completed: {linesCompleted}</h4>
      )}
    </div>
  );
}
