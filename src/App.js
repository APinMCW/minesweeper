import * as React from "react";
import image from "./const";
const Mine = image.cellBomb;

function createField(size) {
  const field = new Array(size * size).fill(0);

  function inc(x, y) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === Mine) return;

      field[y * size + x] += 1;
    }
  }

  for (let i = 0; i < /* количество мин */ 40; ) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (field[y * size + x] === Mine) continue;

    field[y * size + x] = Mine;

    i += 1;

    inc(x + 1, y);
    inc(x - 1, y);
    inc(x, y + 1);
    inc(x, y - 1);
    inc(x + 1, y - 1);
    inc(x - 1, y - 1);
    inc(x + 1, y + 1);
    inc(x - 1, y + 1);
  }

  field.forEach((cell) => {
    switch (cell) {
      case 0:
        cell = image.cellEmpty;
        break;
      case 1:
        cell = image.cell1;
        break;
      case 2:
        cell = image.cell2;
        break;
      case 3:
        cell = image.cell3;
        break;
      case 4:
        cell = image.cell4;
        break;
      case 5:
        cell = image.cell5;
        break;
      case 6:
        cell = image.cell6;
        break;
      case 7:
        cell = image.cell7;
        break;
      case 8:
        cell = image.cell8;
        break;
    }
  });

  return field;
}

function initField(size) {
  const field = new Array(size * size).fill(0);

  for (let i = 0; i < size; ) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    field[y * size + x] += null;

    i += 1;
  }
  return field;
}

const Mask = {
  Transparent: image.cellEmpty,
  Fill: image.celldefault,
  Flag: image.cellFlag,
  Question: image.cellQuestion,
};

export default function App() {
  const size = 10;
  const dimension = new Array(size).fill(null);

  const [defeat, setDefeat] = React.useState(false);
  const [field, setField] = React.useState(() => initField(size));
  const [mask, setMask] = React.useState(() =>
    new Array(size * size).fill(Mask.Fill)
  );
  const [firstClick, setFirstClick] = React.useState(false);
  console.log(field);
  const win = React.useMemo(
    () =>
      !field.some(
        (f, i) =>
          f === Mine &&
          mask[i] !== Mask.Transparent &&
          mask[i] !== Mask.Flag &&
          mask[i] !== Mask.Question &&
          f !== 0
      ),
    [field, mask]
  );

  return (
    <div>
      {dimension.map((_, y) => {
        return (
          <div key={y} style={{ display: "flex" }}>
            {dimension.map((_, x) => {
              return (
                <div
                  key={x}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 0,
                  }}
                  onClick={() => {
                    if (!firstClick) {
                      setField(createField(size));
                      setFirstClick(true);
                      mask[y * size + x] = Mask.Transparent;
                    }

                    if (win || defeat) return;

                    if (mask[y * size + x] === Mask.Transparent) return;

                    const clearing = [];
                    function clear(x, y) {
                      if (x >= 0 && x < size && y >= 0 && y < size) {
                        if (mask[y * size + x] === Mask.Transparent) return;

                        clearing.push([x, y]);
                      }
                    }

                    clear(x, y);

                    while (clearing.length) {
                      const [x, y] = clearing.pop();

                      mask[y * size + x] = Mask.Transparent;

                      if (field[y * size + x] !== 0) continue;

                      clear(x + 1, y);
                      clear(x - 1, y);
                      clear(x, y + 1);
                      clear(x, y - 1);
                    }

                    if (field[y * size + x] === Mine) {
                      mask.forEach((_, i) => (mask[i] = Mask.Transparent));

                      setDefeat(true);
                    }

                    setMask((prev) => [...prev]);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (win || defeat) return;

                    if (mask[y * size + x] === Mask.Transparent) return;

                    if (mask[y * size + x] === Mask.Fill) {
                      mask[y * size + x] = Mask.Flag;
                    } else if (mask[y * size + x] === Mask.Flag) {
                      mask[y * size + x] = Mask.Question;
                    } else if (mask[y * size + x] === Mask.Question) {
                      mask[y * size + x] = Mask.Fill;
                    }

                    setMask((prev) => [...prev]);
                  }}
                >
                  <img
                    src={
                      mask[y * size + x] !== Mask.Transparent
                        ? (mask[y * size + x] = Mask.Fill)
                        : field[y * size + x] === Mine
                        ? (field[y * size + x] = Mine)
                        : field[y * size + x]
                    }
                  ></img>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
