const playgrond = document.getElementById("playground");
const scoreboard = document.getElementById("scoreboard");

const GAME_WIDTH = 40;
const GAME_HEIGHT = 20;

const SCORE_APPLE = 30;
const SCORE_TIME = 1;

var isPlay = false;
var interval = null;
var score = 0;

var nextDiraction = [-1, 0];
var nowDiraction = [-1, 0];
var applePos = [0, 0];

let queue = [];
queueSize = 0;

init();

function init(){
	for(let i = 0; i < GAME_HEIGHT; i++){
		let tr = document.createElement("tr");
		for(let j = 0; j < GAME_WIDTH; j++){
			let td = document.createElement("td");
			if(i == 0 || i == GAME_HEIGHT-1 || j == 0 || j == GAME_WIDTH-1){
				td.classList.add("border");
			}
			tr.appendChild(td);
		}
		playgrond.appendChild(tr);
	}

	window.addEventListener("keydown", e => {
		if(!isPlay)	return newGame();
		
		switch(e.keyCode){
			case 38: //up
				if(nowDiraction[1] == 0){
					nextDiraction = [0, -1];
				}
				break;
			case 40: //down
				if(nowDiraction[1] == 0){
					nextDiraction = [0, 1];
				}
				break;
			case 37: //left
				if(nowDiraction[0] == 0){
					nextDiraction = [-1, 0];
				}
				break;
			case 39: //right
				if(nowDiraction[0] == 0){
					nextDiraction = [1, 0];
				}
				break;
		}
	});
}

function newGame(){
	//remove past data & dom
	while(queueSize > 0){
		popSnake();
	}
	if(applePos[0] != 0){
		getClassList(...applePos).remove("apple");
	}

	isPlay = true;
	score = 0;
	nextDiraction = [-1, 0];
	nowDiraction = [-1, 0];

	addSnake(22, 10);
	addSnake(21, 10);
	addSnake(20, 10);
	createApple();
	interval = setInterval(doAction, 80);
}

function LoseGame(){
	isPlay = false;
	clearInterval(interval);

	scoreboard.innerHTML = "Game End >> score : "+score;
}

function doAction(){
	if(!isPlay) return;

	nowDiraction = [...nextDiraction];

	let x = queue[queueSize-1][0] + nowDiraction[0];
	let y = queue[queueSize-1][1] + nowDiraction[1];
	let nextStep = getClassList(x, y)[0];

	if(nextStep === "border" || nextStep === "snake"){
		LoseGame();
		return;
	}
	else if(nextStep === "apple"){
		getClassList(x, y).remove("apple");	
		createApple();
		score += SCORE_APPLE;
	}
	else{
		popSnake();
	}
	addSnake(x, y);

	score += SCORE_TIME;
	scoreboard.innerHTML = score;
}

function addSnake(x, y){
	getClassList(x, y).add("snake");
	queue.push([x,y]);
	queueSize++;
}

function popSnake(){
	let position = queue.shift();
	queueSize--;
	getClassList(...position).remove("snake");
}

function createApple(){
	let appleX, appleY, appleSpace;

	do{
		appleX = Math.floor(Math.random()*(GAME_WIDTH-2)) + 1;
		appleY = Math.floor(Math.random()*(GAME_HEIGHT-2)) + 2;

		appleSpace = getClassList(appleX, appleY)[0];
	}while(appleSpace !== undefined);

	applePos = [appleX, appleY];
	getClassList(...applePos).add("apple");
}

function getClassList(x, y){
	return playgrond.childNodes[y].childNodes[x].classList;
}