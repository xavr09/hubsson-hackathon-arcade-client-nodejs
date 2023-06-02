////////////////////////////////////////////////////
////////////// DON'T CHANGE THIS FILE //////////////
////////////////////////////////////////////////////

export interface Configuration {
	teamName: string;
	id: string;
	secret: string;
	serverUrl: string;
}

export interface Coordinate {
	x: number;
	y: number;
}

export interface PlayerCoordinates {
	playerId: string;
	coordinates: Coordinate[];
}

export interface GameState {
	width: number;
	height: number;
	iteration: number;
	tickTimeInMs: number;
	players: PlayerCoordinates[];
}

export interface Action {
	direction: Direction,
	iteration: number;
}

export interface JoinMessage {
	teamId: string;
	name: string;
	secret: string;
}

export const enum Direction {
	UP = "Up",
	DOWN = "Down",
	LEFT = "Left",
	RIGHT = "Right"
}

export const enum RealTimeEvent {
	GAME_START = "start",
	GAME_UPDATE = "update",
	JOIN = "join",
	ACTION = "action"
}
