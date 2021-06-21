export const generateRandomArray = size => {
  return [...Array(size + 1).keys()].splice(1).sort(() => 0.5 - Math.random());
};

export const createLinesObj = size => {
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

export const getCompletedStatus = (index, size, obj) => {
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

  return [arr.filter(x => x === 0).length, obj];
};

export const getUndoStatus = (index, size, obj) => {
  const { h, v, d } = obj;
  const q = Math.floor(index / size);
  const r = Math.floor(index % size);
  const d1 = q == r;
  const d2 = q + r === size - 1;
  let arr = [];

  if (d1 && d2) {
    arr = [++h[q], ++v[r], ++d[0], ++d[1]];
  } else if (d1) {
    arr = [++h[q], ++v[r], ++d[0]];
  } else if (d2) {
    arr = [++h[q], ++v[r], ++d[1]];
  } else {
    arr = [++h[q], ++v[r]];
  }

  return [arr.filter(x => x === 1).length, obj];
};
