BOX_SIZE = 3;
LIVE_CELL = 0;
CELL_IDS = [];

function cell(rid, cid) {
  var id = rid + "-" + cid;
  var c = document.createElement("td");
  c.setAttribute("id", id);
  c.classList.add("cell");
  c.addEventListener("click", function () {
    cellSelected(rid, cid);
  });
  CELL_IDS.push(id);
  return c;
}

function cellsInLine(rid, cid) {
  var cells = [];
  for (var c = 0; c < 9; c++) {
    cells.push(rid + "-" + c);
  }
  for (var r = 0; r < 9; r++) {
    cells.push(r + "-" + cid);
  }
  return cells;
}

function blockIndex(rid, cid) {
  br = 0;
  bc = 0;
  if (rid > 2) {
    br = 1;
  }
  if (rid > 5) {
    br = 2;
  }
  if (cid > 2) {
    bc = 1;
  }
  if (cid > 5) {
    bc = 2;
  }
  return { row: br, col: bc };
}

function cellsInBlock(rid, cid) {
  var block = [];
  var bb = blockIndex(rid, cid);
  CELL_IDS.forEach((cellIndex) => {
    var coord = indexToCoord(cellIndex);
    bidx = blockIndex(coord.row, coord.col);
    if (bidx.row == bb.row) {
      if (bidx.col == bb.col) {
        block.push(cellIndex);
      }
    }
  });
  return block;
}

function highlightSame(target) {
  cells = [];
  CELL_IDS.forEach((element) => {
    var c = document.getElementById(element);
    if (c.innerHTML == target) {
      cells.push(element);
    }
  });
  highlightCells(cells);
}

function highlightCells(cids) {
  CELL_IDS.forEach((element) => {
    document.getElementById(element).classList.remove("highlight");
  });
  cids.forEach((element) => {
    var c = document.getElementById(element);
    c.classList.add("highlight");
  });
}

function updateCellValue(cellId, newvalue) {
  var c = document.getElementById(cellId);
  c.innerHTML = newvalue;
}

function setLiveCell(rid, cid) {
  LIVE_CELL = rid + "-" + cid;
}

function cellSelected(rid, cid) {
  setLiveCell(rid, cid);

  th = accum(rid, cid, [cellsInLine, cellsInBlock]);
  highlightCells(th);

  CELL_IDS.forEach((element) => {
    document.getElementById(element).classList.remove("focusCell");
    document.getElementById(element).classList.remove("thisCell");
  });
  document.getElementById(LIVE_CELL).classList.add("thisCell");
}

function getValues(cellIds) {
  values = [];
  cellIds.forEach((cellId) => {
    values.push(document.getElementById(cellId).innerHTML);
  });
  return values;
}

function generateBigCells() {
  var g = document.createElement("table");

  for (var r = 0; r < 3; r++) {
    var row = document.createElement("tr");
    for (var c = 0; c < 3; c++) {
      var cell = document.createElement("td");
      cell.appendChild(generateGrid(r, c));
      row.appendChild(cell);
    }
    g.appendChild(row);
  }
  return g;
}

function generateGrid(rr, cc) {
  var g = document.createElement("table");
  for (var r = 0; r < 3; r++) {
    var row = document.createElement("tr");
    for (var c = 0; c < 3; c++) {
      row.appendChild(cell(r + 3 * rr, c + 3 * cc));
    }
    g.appendChild(row);
  }
  return g;
}

function isDigit(val) {
  return val in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}

function indexToCoord(idx) {
  t = idx.split("-");
  return { row: t[0], col: t[1] };
}

function accum(rid, cid, funcs) {
  v = [];
  funcs.forEach((func) => {
    func(rid, cid).forEach((vv) => {
      v.push(vv);
    });
  });
  return v;
}

function allowedToPlace(newValue, cellId) {
  t = cellId.split("-");
  c = indexToCoord(cellId);
  rid = c.row;
  cid = c.col;
  vv = [];
  vv = accum(rid, cid, [cellsInLine, cellsInBlock]);

  var vs = getValues(vv);
  if (vs.includes(newValue)) {
    return false;
  }
  return true;
}
function placeValue(newValue, cellId) {
  if (isDigit(newValue)) {
    if (allowedToPlace(newValue, cellId)) {
      updateCellValue(cellId, newValue);
    }
  }
}

document.getElementById("main").appendChild(generateBigCells());

document.addEventListener("keypress", (event) => {
  if (event.key == "h") {
    highlightSame(2);
  } else {
    placeValue(event.key, LIVE_CELL);
  }
});

clues = [
  {
    row: 1,
    col: 3,
    value: 1,
  },
  {
    row: 1,
    col: 5,
    value: 9,
  },
  {
    row: 2,
    col: 3,
    value: 5,
  },
  {
    row: 0,
    col: 7,
    value: 1,
  },
  {
    row: 0,
    col: 8,
    value: 6,
  },
  {
    row: 1,
    col: 7,
    value: 2,
  },
  {
    row: 3,
    col: 1,
    value: 3,
  },
  {
    row: 3,
    col: 2,
    value: 8,
  },
  {
    row: 3,
    col: 4,
    value: 6,
  },
  {
    row: 3,
    col: 6,
    value: 2,
  },
  {
    row: 4,
    col: 3,
    value: 4,
  },
  {
    row: 4,
    col: 5,
    value: 2,
  },
  {
    row: 4,
    col: 7,
    value: 7,
  },
  {
    row: 4,
    col: 8,
    value: 1,
  },
  {
    row: 5,
    col: 1,
    value: 1,
  },
  {
    row: 5,
    col: 4,
    value: 5,
  },
  {
    row: 5,
    col: 8,
    value: 8,
  },
  {
    row: 6,
    col: 3,
    value: 7,
  },
  {
    row: 7,
    col: 0,
    value: 6,
  },
  {
    row: 7,
    col: 1,
    value: 7,
  },
  {
    row: 7,
    col: 4,
    value: 9,
  },
  {
    row: 7,
    col: 8,
    value: 3,
  },
  {
    row: 8,
    col: 0,
    value: 9,
  },
  {
    row: 8,
    col: 4,
    value: 1,
  },
  {
    row: 8,
    col: 5,
    value: 4,
  },
  {
    row: 8,
    col: 7,
    value: 5,
  },
];

function markClue(cellId) {
  document.getElementById(cellId).classList.add("clue");
}

function placeClues(clues) {
  clues.forEach((clue) => {
    var cellId = clue.row + "-" + clue.col;
    updateCellValue(cellId, clue.value);
    markClue(cellId);
  });
}
placeClues(clues);
