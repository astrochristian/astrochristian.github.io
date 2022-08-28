var clues_grid = [[]];
var player_grid = [[]];
var answer_grid = [[]];

var boardSize = 9;
var cell_size = 45;

var clues_grid = [
	[1,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,2,0],
	[0,0,0, 0,0,0, 0,0,0],

	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,9,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0],

	[0,0,0, 0,0,0, 0,7,0],
	[0,4,0, 0,0,0, 0,1,0],
	[0,0,0, 0,0,0, 0,0,0]
];

var player_grid = [
	[1,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,2,0],
	[0,0,0, 0,0,0, 0,0,0],

	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,9,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0],

	[0,0,0, 0,0,0, 0,7,0],
	[0,4,0, 0,0,0, 0,1,0],
	[0,0,0, 0,0,0, 0,0,0]
];

var answer_grid = [
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

const arrayColumn = (arr, n) => arr.map(x => x[n]); // Get column from 2D array
const copy = (arr) => JSON.parse(JSON.stringify(arr)); // Deep copy array

function checkGame() {
	// Create array of "truth values"
	var truth_values = []

	// Check if all rows are correct
	for (var i = 0; i < 9; i++) {
		var row = copy(player_grid[i]);

		// Sort the row
		row.sort();

		// Check whether it is a solution
		truth_values.push(row.join(',') == '1,2,3,4,5,6,7,8,9');
	}

	// Check if all columns are correct
	for (var j = 0; j < 9; j++) {
		var col = arrayColumn(player_grid, j);
		
		// Sort the column
		col.sort();

		// Check whether it is a solution
		truth_values.push(col.join(',') == '1,2,3,4,5,6,7,8,9');
	}

	// Check if all cells are correct
	for (var k = 0; k < 9; k++) {
	    var x1 = (k * 3) % 9;
	    var x2 = x1 + 3;

	    var y1 = Math.floor(k / 3) * 3;
	    var y2 = y1 + 3;

	    var section = player_grid.slice(y1, y2).map(i => i.slice(x1, x2))
		
		var section_flat = section.flat()

		section_flat.sort()

		// Check whether it is a solution
		truth_values.push(section_flat.join(',') == '1,2,3,4,5,6,7,8,9');
	}

	if (truth_values.every(function(e){return e;})) {
		alert("You're correct!");
	} else {
		alert("Incorrect. Keep trying!");
	}
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

function generateClues() {
	// Generate clues randomly

}

function generateGame() {
	boardSize = document.getElementById("boardSizeInput").value;
	
	grid = [];
	player_grid = [];

	// Generate the grid
	for (var x = 0; x < boardSize; x++) {
		grid.push([]);
		player_grid.push([])

		for (var y = 0; y < boardSize; y++) {
			grid[x].push(Math.round(Math.random()));
			player_grid[x].push(0);
		}
	}

	drawGrid();
	generateClues();
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

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('gridCanvas').addEventListener('click', on_canvas_click, false);

	document.getElementById('gridCanvas').addEventListener('contextmenu', on_canvas_right_click, false);

	drawGrid();
});