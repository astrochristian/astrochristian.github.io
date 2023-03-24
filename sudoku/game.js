var unsorted_grid = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],

  [2, 3, 1, 5, 6, 4, 8, 9, 7],
  [5, 6, 4, 8, 9, 7, 2, 3, 1],
  [8, 9, 7, 2, 3, 1, 5, 6, 4],

  [3, 1, 2, 6, 4, 5, 9, 7, 8],
  [6, 4, 5, 9, 7, 8, 3, 1, 2],
  [9, 7, 8, 3, 1, 2, 6, 4, 5],
];

BLANK_GRID = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function newFrom(grid) {
  return JSON.parse(JSON.stringify(grid));
}

// game logic

function isGameValid(grid) {
  // check if the grid is valid by checking if each row, column and section has all numbers 1-9
  // rows
  for (var i = 0; i < 9; i++) {
    var row = JSON.parse(JSON.stringify(grid[i]));
    row.sort();
    if (row.join(",") != "1,2,3,4,5,6,7,8,9") {
      return false;
    }
  }

  // columns
  for (var j = 0; j < 9; j++) {
    var col = grid.map((i) => i[j]);
    col.sort();
    if (col.join(",") != "1,2,3,4,5,6,7,8,9") {
      return false;
    }
  }

  // sections
  for (var k = 0; k < 9; k++) {
    var x1 = (k * 3) % 9;
    var x2 = x1 + 3;

    var y1 = Math.floor(k / 3) * 3;
    var y2 = y1 + 3;

    var section = grid.slice(y1, y2).map((i) => i.slice(x1, x2));

    var section_flat = section.flat();
    section_flat.sort();

    if (section_flat.join(",") != "1,2,3,4,5,6,7,8,9") {
      return false;
    }
  }

  return true;
}

function generateClues(answer_grid) {
  // create a clues grid by randomly sampling from the answer grid
  var clues_grid = [];

  for (var x = 0; x < 9; x++) {
    clues_grid.push([]);
    for (var y = 0; y < 9; y++) {
      clues_grid[x].push(0);
    }
  }

  // Generate clues randomly
  for (var i = 0; i < 30; i++) {
    var x_pos = Math.floor(Math.random() * 9);
    var y_pos = Math.floor(Math.random() * 9);

    clues_grid[x_pos][y_pos] = answer_grid[x_pos][y_pos];
  }

  return clues_grid;
}

function transpose(a) {
  // transposes a 2D array
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if (h === 0 || w === 0) {
    return [];
  }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i,
    j,
    t = [];

  // Loop through every item in the outer array (height)
  for (i = 0; i < h; i++) {
    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for (j = 0; j < w; j++) {
      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
}

function newPlayerGrid() {
  // Generate a blank player grid (9x9 array of 0s)
  var new_grid = [];

  // Generate a blank new grid
  for (var x = 0; x < boardSize; x++) {
    new_grid.push([]);

    for (var y = 0; y < boardSize; y++) {
      new_grid[x].push(0);
    }
  }

  return new_grid;
}

function newAnswerGrid() {
  // Generate a new answer grid by randomly permuting the answer grid, preserving solvability
  var new_answer_grid = newFrom(unsorted_grid);

  var N_perms = 1000;
  for (var i = 0; i < N_perms; i++) {
    // Swap two lines within a block
    var rotate_dir = Math.floor(2 * Math.random());

    // Choose block number
    var block_no = Math.floor(3 * Math.random());

    // Choose line 1
    var line1 = Math.floor(3 * Math.random());

    // Find line 2
    var line2_shift = Math.floor(2 * Math.random());

    switch (line1) {
      case 0:
        var line2 = line2_shift + 1;
        break;

      case 1:
        var line2 = 2 * line2_shift;
        break;

      case 2:
        var line2 = 1 - line2_shift;
        break;
    }

    if (rotate_dir == 0) {
      // Switch rows in horizontal direction
      var answer_grid_tr = transpose(new_answer_grid);

      var temp_array = answer_grid_tr[block_no * 3 + line1];

      answer_grid_tr[block_no * 3 + line1] =
        answer_grid_tr[block_no * 3 + line2];
      answer_grid_tr[block_no * 3 + line2] = temp_array;

      new_answer_grid = transpose(answer_grid_tr);
    } else {
      // Switch rows in vertical direction
      var temp_array = new_answer_grid[block_no * 3 + line1];

      new_answer_grid[block_no * 3 + line1] =
        new_answer_grid[block_no * 3 + line2];
      new_answer_grid[block_no * 3 + line2] = temp_array;
    }
  }
  return new_answer_grid;
}

// vue

vue_app = {
  data() {
    return {
      grid: newFrom(BLANK_GRID),
      clues: newFrom(BLANK_GRID),
      answer: newFrom(BLANK_GRID),
    };
  },
  methods: {
    incrementCell(row_index, col_index) {
      this.grid[row_index][col_index] =
        (this.grid[row_index][col_index] + 1) % 10;
    },
    decrementCell(row_index, col_index) {
      this.grid[row_index][col_index] =
        (this.grid[row_index][col_index] + 9) % 10;
    },
    clearCell(row_index, col_index) {
      this.grid[row_index][col_index] = 0;
    },
    clearGrid() {
      this.grid = newFrom(BLANK_GRID);
    },
    newGame() {
      this.clearGrid();
      this.answer = newAnswerGrid();
      this.clues = generateClues(this.answer);
    },
    checkAnswer() {
      const valid = isGameValid(this.grid);
      if (valid) {
        alert("You're Correct!");
      } else {
        alert("Incorrect. Keep trying!");
      }
    },
    revealAnswer() {
      this.grid = JSON.parse(JSON.stringify(this.answer));
    },
    saveGame() {
      const clues_encoded = btoa(JSON.stringify(this.clues));
      const player_encoded = btoa(JSON.stringify(this.grid));
      const answer_encoded = btoa(JSON.stringify(this.answer));

      const lcode = clues_encoded + "," + player_encoded + "," + answer_encoded;
      const link =
        location.protocol +
        "//" +
        location.host +
        location.pathname +
        "?code=" +
        lcode;

      window.open(link);
    },
  },
  mounted() {
    const rcode =
      decodeURIComponent(
        (new RegExp("[?|&]" + "code" + "=" + "([^&;]+?)(&|#|;|$)").exec(
          location.search
        ) || [null, ""])[1].replace(/\+/g, "%20")
      ) || null;

    if (rcode !== null) {
      const encoded_grids = rcode.split(",");

      this.clues = JSON.parse(atob(encoded_grids[0]));
      this.grid = JSON.parse(atob(encoded_grids[1]));
      this.answer = JSON.parse(atob(encoded_grids[0]));
    } else {
      this.newGame();
    }
  },
};
