import { GameState, Direction } from "../libs/model";
import { GameClient } from "../libs/game-client";
import { Coordinate } from "../libs/model";
import { config } from "./config";


const gameClient = new GameClient(config);
let xyCoordinates: Coordinate[] = [];

gameClient.onGameStart((): void => {
	console.log("Game started!");
});

gameClient.onGameUpdate ((gameState: GameState): void => {
	console.log("Game State received");
	//gameClient.sendAction(Direction.RIGHT, gameState.iteration);

	console.log("height = " + gameState.height);
	console.log("width = " + gameState.width);
	console.log("iteration = " + gameState.iteration);
	console.log("Players Size = " + gameState.players.length);
	let playerId = "";
	let len = 0;
	for( let i = 0; i < gameState.players.length; i++){
		playerId = gameState.players[i].playerId;
		console.log("Player Id = " + playerId);
		console.log("Players Coordinates = " + gameState.players[i].coordinates.length);		
		for( let j = 0; j < len; j++){
			if(xyCoordinates.indexOf(gameState.players[i].coordinates[j]) === -1){
				xyCoordinates.push(gameState.players[i].coordinates[j]);
			}												
		}


		if (playerId === 'arcnade'){	
			len = gameState.players[i].coordinates.length;
			console.log("##############len################# = " + len);
			let previousPosition = 0;
			let xPrevCoord = 0;
			let yPrevCoord = 0;
			let direction = "";
			if(len >=2){


				previousPosition = len -2;
				console.log("##############previousPosition################# = " + previousPosition);
				xPrevCoord = gameState.players[i].coordinates[previousPosition].x;
				yPrevCoord = gameState.players[i].coordinates[previousPosition].y;
			}		
			let currentPosition = len - 1;
			console.log("##############currentPosition################# = " + currentPosition);
			let xCoord = gameState.players[i].coordinates[currentPosition].x;
			let yCoord = gameState.players[i].coordinates[currentPosition].y;
			
			console.log("(xPrevCoord, xPrevCoord) = (" + xPrevCoord + ", " + yPrevCoord + ")");
			console.log("(xCoord, yCoord) = (" + xCoord + ", " + yCoord + ")");
			direction = checkDirection(xCoord, yCoord, xPrevCoord, yPrevCoord);
			console.log("##############direction################# = " + direction);
			if (direction ===  Direction.UP && yCoord <= 45){
				gameClient.run();
				gameClient.sendAction(Direction.RIGHT, gameState.iteration);
				console.log("Gamestate Direction RIGHT received");
			}else if (direction ===  Direction.RIGHT && xCoord < gameState.width - 10){
				gameClient.run();
				gameClient.sendAction(Direction.UP, gameState.iteration);				
				console.log("Gamestate Direction UP received");
			}else if (checkCoordinates(xCoord + 1, yCoord) === 0){
				gameClient.run();
				gameClient.sendAction(Direction.RIGHT, gameState.iteration);
				console.log("Gamestate Direction RIGHT received");
			}else if (checkCoordinates(xCoord, yCoord + 1) === 0){
				gameClient.run();
				gameClient.sendAction(Direction.UP, gameState.iteration);				
				console.log("Gamestate Direction UP received");
			}else if (checkCoordinates(xCoord, yCoord - 1) === 0){
				gameClient.run();
				gameClient.sendAction(Direction.DOWN, gameState.iteration);				
				console.log("Gamestate Direction DOWN received");
			}else if (checkCoordinates(xCoord - 1, yCoord) === 0){
				gameClient.run();
				gameClient.sendAction(Direction.LEFT, gameState.iteration);				
				console.log("Gamestate Direction LEFT received");
			}	
			console.log("Gamestate update completed!");			
});

//direction
function checkDirection (x: number, y: number, xPrev: number, yPrev: number): string {
	console.log("[checkDirection](x, y) = (" + x + ", " + y + ")");
	if(x === xPrev && y > yPrev){
		return Direction.UP;
	}else if(x === xPrev && y < yPrev){
		return Direction.DOWN;
	}else if(x > xPrev && y === yPrev){
		return Direction.RIGHT;
	}else {
		return Direction.LEFT;
	}	
}

function checkCoordinates (x: number, y: number): number {
	console.log("[checkCoordinates](x, y) = (" + x + ", " + y + ")");
	let len = xyCoordinates.length;
	for( let j = 0; j < len; j++){
		if(xyCoordinates[j].x === x && xyCoordinates[j].y === y ){
			return 1;
		}										
	}
	return 0;

}
gameClient.run();

