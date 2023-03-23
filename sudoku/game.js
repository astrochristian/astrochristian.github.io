var boardSize = 9;
var cell_size = 45;

var unsorted_grid = [
	[1,2,3, 4,5,6, 7,8,9],
	[4,5,6, 7,8,9, 1,2,3],
	[7,8,9, 1,2,3, 4,5,6],

	[2,3,1, 5,6,4, 8,9,7],
	[5,6,4, 8,9,7, 2,3,1],
	[8,9,7, 2,3,1, 5,6,4],

	[3,1,2, 6,4,5, 9,7,8],
	[6,4,5, 9,7,8, 3,1,2],
	[9,7,8, 3,1,2, 6,4,5]
];

var clues_grid = [];
var player_grid = [];
var answer_grid = [];

const arrayColumn = (arr, n) => arr.map(x => x[n]); // Get column from 2D array
const copy = (arr) => JSON.parse(JSON.stringify(arr)); // Deep copy array

function checkGame() {
	const gameValid = isGameValid(player_grid);

	if (gameValid) {
		alert("You're correct!");
	} else {
		alert("Incorrect. Keep trying!");
	}
}

function isGameValid(grid) {
	// Check if all rows are correct
	for (var i = 0; i < 9; i++) {
		var row = copy(grid[i]);

		// Sort the row
		row.sort();

		// Check whether it is a solution
		if (row.join(',') != '1,2,3,4,5,6,7,8,9') {
			return false;
		}
	}

	// Check if all columns are correct
	for (var j = 0; j < 9; j++) {
		var col = arrayColumn(grid, j);
		
		// Sort the column
		col.sort();

		// Check whether it is a solution
		if (col.join(',') != '1,2,3,4,5,6,7,8,9') {
			return false;
		}
	}

	// Check if all cells are correct
	for (var k = 0; k < 9; k++) {
	    var x1 = (k * 3) % 9;
	    var x2 = x1 + 3;

	    var y1 = Math.floor(k / 3) * 3;
	    var y2 = y1 + 3;

		var section = grid.slice(y1, y2).map(i => i.slice(x1, x2))
		
		var section_flat = section.flat()

		section_flat.sort()

		// Check whether it is a solution
		if (section_flat.join(',') != '1,2,3,4,5,6,7,8,9') {
			return false;
		}
	}

	return true;
}

function drawGrid() {
	// Get canvas and context
	var canvas = document.getElementById("gridCanvas");

	canvas.width = boardSize * cell_size;
	canvas.height = canvas.width;

	var ctx = canvas.getContext("2d");
	
	// Draw vertical lines
	for (var x = 0; x < canvas.width; x+=cell_size) {
		ctx.beginPath();

		if (x % (cell_size*3) == 0 && x > 0) {
			ctx.strokeStyle = "#00F";
			ctx.lineWidth = 2;
		} else {
			ctx.strokeStyle = "#777";
			ctx.lineWidth = 1;
		}

		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
		ctx.closePath();
	}

	// Draw horizontal lines
	for (var y = 0; y < canvas.height; y+=cell_size) {
		ctx.beginPath();
		
		if (y % (cell_size*3) == 0 && y > 0) {
			ctx.strokeStyle = "#00F";
			ctx.lineWidth = 2;
		} else {
			ctx.strokeStyle = "#777";
			ctx.lineWidth = 1;
		}

		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
		ctx.closePath();
	}

	// Draw the numbers
	for (var x = 0; x < boardSize; x++) {
		for (var y = 0; y < boardSize; y++) {
			var clue_square = clues_grid[x][y];
			var player_square = player_grid[x][y];

			if (clue_square > 0) {
				// Place number at position
				ctx.font = "40px Arial";
				ctx.fillStyle = "#F00";

				ctx.fillText(clue_square, x*cell_size + 12, y*cell_size + 38); 

			} else if (player_square > 0) {
				// Place number at position
				ctx.font = "40px Arial";
				ctx.fillStyle = "#000";

				ctx.fillText(player_square, x*cell_size + 12, y*cell_size + 38); 
			}
		}
	}
}

function generateClues(answer_grid) {
	// Generate a blank clues grid
	var clues_grid = [];

	for (var x = 0; x < boardSize; x++) {
		clues_grid.push([])

		for (var y = 0; y < boardSize; y++) {
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

function arrayRotate(arr) {
	arr.unshift(arr.pop());
	return arr;
}

function transpose(a) {

	// Calculate the width and height of the Array
	var w = a.length || 0;
	var h = a[0] instanceof Array ? a[0].length : 0;
  
	// In case it is a zero matrix, no transpose routine needed.
	if(h === 0 || w === 0) { return []; }
  
	/**
	 * @var {Number} i Counter
	 * @var {Number} j Counter
	 * @var {Array} t Transposed data is stored in this array.
	 */
	var i, j, t = [];
  
	// Loop through every item in the outer array (height)
	for(i=0; i<h; i++) {
  
	  // Insert a new row (array)
	  t[i] = [];
  
	  // Loop through every item per item in outer array (width)
	  for(j=0; j<w; j++) {
  
		// Save transposed data.
		t[i][j] = a[j][i];
	  }
	}
  
	return t;
  }
  
function newPlayerGrid() {
	var new_grid = [];

	// Generate a blank new grid
	for (var x = 0; x < boardSize; x++) {
		new_grid.push([])

		for (var y = 0; y < boardSize; y++) {
			new_grid[x].push(0);
		}
	}

	return new_grid;
}

function newAnswerGrid() {
	var new_answer_grid = JSON.parse(JSON.stringify(unsorted_grid));
	// Randomly sort the player grid while preserving solvability
	var N_perms = 1000;

	for (var i = 0; i < N_perms; i++) {
		// Swap two lines within a block
		var rotate_dir = Math.floor(Math.random() + 0.5);

		// Choose block number
		var block_no = Math.floor(2*Math.random() + 0.5);

		// Choose line 1
		var line1 = Math.floor(2*Math.random() + 0.5);

		// Find line 2
		var line2_shift = Math.floor(Math.random() + 0.5);

		switch (line1) {
			case 0:
				var line2 = line2_shift + 1;
				break;

			case 1:
				var line2 = 2*line2_shift;
				break;

			case 2:
				var line2 = 1 - line2_shift;
				break;
		}

		if (rotate_dir == 0) {
			// Switch rows in horizontal direction
			var answer_grid_tr = transpose(new_answer_grid)

			var temp_array = answer_grid_tr[block_no * 3 + line1];

			answer_grid_tr[block_no * 3 + line1] = answer_grid_tr[block_no * 3 + line2];
			answer_grid_tr[block_no * 3 + line2] = temp_array;

			new_answer_grid = transpose(answer_grid_tr);
			
		} else {
			// Switch rows in vertical direction
			var temp_array = new_answer_grid[block_no * 3 + line1];

			new_answer_grid[block_no * 3 + line1] = new_answer_grid[block_no * 3 + line2];
			new_answer_grid[block_no * 3 + line2] = temp_array;
		}
	}
	return new_answer_grid;
}

function generateGame() {
	player_grid = newPlayerGrid();
	answer_grid = newAnswerGrid();
	clues_grid = generateClues(answer_grid);

	drawGrid();
}

function revealAnswer() {
	player_grid = copy(answer_grid);

	drawGrid();
}

function clearGrid() {
	for (var x = 0; x < boardSize; x++) {
		for (var y = 0; y < boardSize; y++) {
			player_grid[x][y] = 0;
		}
	}

	drawGrid();
}

function on_canvas_click(ev) {
	var canvas = document.getElementById("gridCanvas");

    var x = ev.clientX - canvas.getBoundingClientRect().left;
    var y = ev.clientY - canvas.getBoundingClientRect().top;

    // Find square
    var x_grid = Math.floor(x/cell_size);
    var y_grid = Math.floor(y/cell_size);

    if (clues_grid[x_grid][y_grid] == 0) {
	    player_grid[x_grid][y_grid] = (player_grid[x_grid][y_grid] + 1) % 10;
	}

    drawGrid();
}

function on_canvas_right_click(ev) {
    ev.preventDefault();
	   	
    var canvas = document.getElementById("gridCanvas");

    var x = ev.clientX - canvas.getBoundingClientRect().left;
    var y = ev.clientY - canvas.getBoundingClientRect().top;

    // Find square
    var x_grid = Math.floor(x/cell_size);
    var y_grid = Math.floor(y/cell_size);

    if (clues_grid[x_grid][y_grid] == 0) {
    	player_grid[x_grid][y_grid] = 0;
    }

    drawGrid();

    return false;
}

function saveGame() {
	var clues_encoded = btoa(JSON.stringify(clues_grid));
	var player_encoded = btoa(JSON.stringify(player_grid));
	var answer_encoded = btoa(JSON.stringify(answer_grid));

	var lcode = clues_encoded + "," + player_encoded + "," + answer_encoded;
	var link = location.protocol + '//' + location.host + location.pathname + "?code=" + lcode;

	window.open(link);
}

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

var rcode = getURLParameter("code");

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('gridCanvas').addEventListener('click', on_canvas_click, false);

	document.getElementById('gridCanvas').addEventListener('contextmenu', on_canvas_right_click, false);

	if (rcode !== null) {
		var encoded_grids = rcode.split(",");

		clues_grid = JSON.parse(atob(encoded_grids[0]));
		player_grid = JSON.parse(atob(encoded_grids[1]));
		answer_grid = JSON.parse(atob(encoded_grids[0]));
	} else {
		generateGame();
	}
	
	drawGrid();
});

// vue

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

function newBlankGrid() {
	return JSON.parse(JSON.stringify(BLANK_GRID));
}

vue_app = {
	data() {
		return {
			grid: newBlankGrid(),
			clues: newBlankGrid(),
			answer: newBlankGrid(),
		}
	},
	methods: {
		incrementCell(row_index, col_index) {
			this.grid[row_index][col_index] = (this.grid[row_index][col_index] + 1) % 10;
		},
		clearCell(row_index, col_index) {
			this.grid[row_index][col_index] = 0;
		},
		newGame() {
			this.clearGrid();
			this.answer = newAnswerGrid();
			this.clues = generateClues(this.answer);
		},
	},
	mounted() {
		this.clues = clues_grid;
	},
}
