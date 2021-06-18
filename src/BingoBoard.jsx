import React from 'react';
import { useLocalState } from './useLocalState';
import {
  generateRandomArray,
  createLinesObj,
  getCompletedStatus
} from './utils';
import './style.css';

export default function BingoBoard() {
  const [size, setSize] = useLocalState('bingo-size', 5);
  const [randomArray, setRandomArray] = useLocalState('bingo-keys', () =>
    generateRandomArray(size * size)
  );
  const [selected, setSelected] = useLocalState('bingo-selected-keys', []);
  const [canUndo, setCanUndo] = useLocalState('bingo-can-undo', false);
  const [linesObj, setLinesObj] = useLocalState('bingo-lines-obj', () =>
    createLinesObj(size)
  );
  const [linesCompleted, setLinesCompleted] = useLocalState(
    'bingo-completed-lines',
    0
  );
  const boardSizes = [3, 4, 5, 6, 7, 8, 9, 10];
  React.useEffect(() => {
    linesCompleted == size && setCanUndo(false);
  }, [linesCompleted, size]);

  const handleClick = (key, index) => {
    if (!selected.includes(key) && linesCompleted < size) {
      const newSelected = [...selected, key];
      setSelected(newSelected);
      setCanUndo(true);

      const [completedLines, obj] = getCompletedStatus(index, size, linesObj);
      setLinesObj(JSON.parse(JSON.stringify(obj)));
      completedLines > 0 && setLinesCompleted(linesCompleted + completedLines);
    }
  };
  const handleUndo = () => {
    setSelected(arr => arr.slice(0, -1));
    setCanUndo(false);
  };
  const handleNewGame = size => {
    localStorage.clear();
    setRandomArray(generateRandomArray(size * size));
    setSelected([]);
    setCanUndo(false);
    setLinesObj(createLinesObj(size));
    setLinesCompleted(0);
  };
  const handleSizeChange = size => {
    setSize(size);
    handleNewGame(size);
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
        {/* <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="bingo-button"
        >
          Undo
        </button> */}

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
        <h1 className="title">You WON !!!</h1>
      ) : (
        <h4 className="title">Lines Completed: {linesCompleted}</h4>
      )}
    </div>
  );
}
