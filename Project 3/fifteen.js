/*
Extra Features:
	End-of-Game: Complete
	Animations: Complete
	Multiple backgrounds: Complete
	Game timer with sound: Complete
*/

var puzzle = document.getElementById("puzzle");
var puzzleContents = puzzle.children;

//Variable to track if puzzle in initial solved state
var startingState; 

//Variables to track moves 
var counter = document.querySelector(".counter");
var moves = 0; 

//Variables to track timer
var second = 0, minute = 0;
var timer = document.querySelector(".timer");
var interval;

//Variables store final time/moves
var finalTime;
var finalMoves;


/** Change puzzle background; Needs global scope **/
function changeBackground(){
	var val = document.getElementById("animaniacs").value;

	for(var i = 0; i < puzzleContents.length - 1; i++){
		puzzleContents[i].style.backgroundImage = "url('./Images/" + val + ".png')"; //url('./Images/wakko.png');
	}
}

(function(){
	var startingState = true; //Checks if in starting state; fix for win loop

	initialize(); //Initialize puzzle position, timer, and counter

	//Listen for click on square
	puzzle.addEventListener("click", function(e){
		if(startingState){
			puzzle.className = "animate";
			shiftSquare(e.target);
		}
	});

	document.getElementById("shuffle").addEventListener("click", shuffle); //Listen for click on shuffle
	

	/***! FUNCTIONS !***/
	
	/** Start incrementing timer **/
	function startTimer(){
		interval = setInterval(function(){
			timer.innerHTML = minute + " mins " + second +" secs";
			second++;
			if(second == 60){
				minute++;
				second=0;
			}
		},1000);
	}

	/** Increment move counter **/
	function moveCounter(){
		moves++;
		counter.innerHTML = moves + " Move(s)";
	}

	/** Initialize puzzle in solved state **/
	function initialize(){
		var toppx = 0;
		var leftpx = 0;

		for(var i = 0; i < puzzleContents.length; i++){
			puzzleContents[i].className = "puzzlepiece";

			//Set top and left
			puzzleContents[i].style.top = toppx + "px";
			puzzleContents[i].style.left = leftpx + "px";

			//Set background image and position
			changeBackground();
			puzzleContents[i].style.backgroundPosition = "-" + leftpx + "px " + "-" + toppx + "px";

			//Update top and left positions
			if(leftpx == 300){
				var toppx = toppx + 100; 
				var leftpx = 0; 
			}else{
				var leftpx = leftpx + 100;
        	}

       	 	//Set empty
			if(i == puzzleContents.length - 1){
				puzzleContents[i].className = "empty";
				puzzleContents[i].style.backgroundPosition = "";
			}
		}
		timer.innerHTML = "0 mins 0 secs";
		counter.innerHTML = moves + " Move(s)";
	}

	/** Shift square into empty space **/
	function shiftSquare(square){
		if(square.className != "empty"){
			var emptySquare = getEmptyAdjacentSquare(square);

			if(emptySquare){
				var temptop = square.style.top;
				var templeft = square.style.left;
				var tempid = square.id;
				//Swap id and style
				square.style.top = emptySquare.style.top;
				square.style.left = emptySquare.style.left;
				square.id = emptySquare.id;

				emptySquare.style.top = temptop;
				emptySquare.style.left = templeft;
				emptySquare.id = tempid;
				
				moveCounter();

				if(startingState){
					checkForWin();
				}
			}
		}
	}

	/** Get and return square by row and col **/
	function getSquare(row, col){
		return document.getElementById("square_" + row + "_" + col);
	}

	/** Return array of squares adjacent to current square **/
	function getAdjacentSquares(square){
		var id = square.id.split("_");

		//Get square position
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);

		var adj = [];

		//Get all adj
		if(row > 1){
			adj.push(getSquare(row - 1, col)); //up
		}
		if(row < 4){
			adj.push(getSquare(row + 1, col)); //down
		}
		if(col < 4){
			adj.push(getSquare(row, col + 1)); //left
		}
		if(col > 1){
			adj.push(getSquare(row, col - 1)); //right
		}
		return adj;

	}

	/** Get and return empty square **/
	function getEmptySquare(){
		return puzzle.querySelector(".empty");
	}

	/** Get empty square if adjacent to current square **/
	function getEmptyAdjacentSquare(square){
		//Gets all adj sqaures
		var adj = getAdjacentSquares(square);

		//Search for empty cell
		for(var i = 0; i < adj.length; i++){
			if(adj[i].className == "empty"){
				return adj[i];
			}
		}

		//Empty square not found
		return false;
	}

	/** Shuffle puzzle **/
	function shuffle(){
		if(!startingState){
			return;
		}

		startingState = false;

		var adjacent, rand, randSquare;
		document.body.style.background = "white";

		for(var i = 0; i < 300; i++){
			adjacent = getAdjacentSquares(getEmptySquare());
			rand = Math.floor(Math.random() * adjacent.length);
			randSquare = adjacent[rand];

			shiftSquare(randSquare);
		}
		startingState = true;

		//Restart timer
		second = 0;
		minute = 0;
		timer.innerHTML = "0 mins 0 secs";
		clearInterval(interval);
		startTimer();
		//Restart moves
		moves = 0;
		counter.innerHTML = moves + " Move(s)";
	}

	/** Check order of squares for win **/
	function checkForWin(){
		startingState = true;
		//Check empty cell
		if(getSquare(4, 4).className != "empty"){
			return;
		}
	
		var n = 1;
		//Check all squares in correct position
		for(var i = 1; i <= 4; i++){
			for(var j = 1; j <= 4; j++){
				if(n <= 15 && getSquare(i, j).innerHTML != n.toString()){
					//Order not correct
					return;
				}
				n++;
			}
		}

		/** After win **/
		document.body.style.backgroundImage = "url('./Images/confetti2.gif')"; //change background
		//Store time and moves
		finalTime = timer.innerHTML;
		finalMoves = counter.innerHTML;
		//Display time and moves after few seconds
		setTimeout(function(){
			if(confirm("Time: " + finalTime + "\nMoves: " + finalMoves)){
				shuffle();
			}
		}, 1200);
		
		//Reset timer
		moves = 0;
		second = 0;
		minute = 0;
		timer.innerHTML = "0 mins 0 secs";
		counter.innerHTML = moves + " Move(s)";
	}

}());
