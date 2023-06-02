import { GameState, Direction } from "../libs/model";
import { GameClient } from "../libs/game-client";

import { config } from "./config";


const gameClient = new GameClient(config);

gameClient.onGameStart((): void => {
	console.log("Game started!");
});

gameClient.onGameUpdate((gameState: GameState): void => {
	console.log("Game State received");
	gameClient.sendAction(Direction.UP, gameState.iteration);
});

gameClient.run();
