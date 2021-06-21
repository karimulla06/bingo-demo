import React from 'react';
import './confetti.scss';

export default function Confetti() {
  const arr = [...Array(150).keys()];
  return (
    <div>
      {arr.map(i => (
        <div className={'confetti-' + i} />
      ))}
    </div>
  );
}
