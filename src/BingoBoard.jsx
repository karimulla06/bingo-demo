import React from 'react';
import './style.css';

const generateRandomArray = (size) => {
  return [...Array(size+1).keys()]
          .splice(1)
          .sort(()=>0.5 - Math.random())
};
export default function BingoBoard({size=5}) {
  const randomArray = React.useMemo(()=>generateRandomArray(size*size),[size]);
  const [selected,setSelected] = React.useState([]);

  const handleClick = (key) => {
    setSelected(arr => [...arr,key]);
    console.log(key);
  };

  const getCell = key => {
    const cellProps = {
      className:"bingo-box",
      onClick: () => handleClick(key),
      style: {
        backgroundColor: selected.includes(key) && 'cyan'
      }
    }
    return(
      <div {...cellProps} key={key} >{key}</div>
    );
  }
  return (
    <>
    <h2 className='title'>B I N G O</h2>
    <div className="bingo-grid" style={{width:`${size*5}vw`}}>
    {
      randomArray.map(key => getCell(key))
    }
    </div>
    </>
  );
}
