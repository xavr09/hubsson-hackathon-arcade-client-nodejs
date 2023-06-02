////////////////////////////////////////////////////
////////////// DON'T CHANGE THIS FILE //////////////
////////////////////////////////////////////////////
import { io, Socket } from "socket.io-client";

import { Action, GameState, Configuration, Direction, JoinMessage, RealTimeEvent } from "./model";

export class GameClient {
	private readonly config: Configuration;
	private readonly socket: Socket;
	private gameStartCb: () => void | undefined;
	private gameUpdateCb: (gameState: GameState) => void;

	constructor(config: Configuration) {
		this.config = config;
		this.socket = io(config.serverUrl, {
			transports: ["websocket"]
		});
	}

	public onGameStart(cb: () => void) {
		this.gameStartCb = cb;
	}

	public onGameUpdate(cb: (gameState: GameState) => void) {
		this.gameUpdateCb = cb;
	}

	public sendAction(direction: Direction, iteration: number) {
		try {
			const action: Action = { direction, iteration };
			this.socket.volatile.emit(RealTimeEvent.ACTION, { direction, iteration });
		} catch(error) {
			console.error("Error sending action!", error);
		}
	}

	public run() {
		this.socket.on("connect", () => {
			console.log(`Connected to the game server! SocketId: ${this.socket.id}`);
			this.sendJoinMessage();
		});

		this.socket.on("disconnect", () => {
			console.log("Disconnected!");
		});

		this.socket.on("connect_error", error => {
			console.error("Connection Error!", error);
		});

		this.socket.on(RealTimeEvent.GAME_START, () => {
			try {
				this.gameStartCb?.();
			} catch(error) {
				console.error(error)
			}
		});

		this.socket.on(RealTimeEvent.GAME_UPDATE, (gameState: GameState) => {
			try {
				this.gameUpdateCb?.(gameState);
			} catch(error) {
				console.error(error)
			}
		});
	}

	private sendJoinMessage() {
		const { teamName, id, secret } = this.config;
		const joinMessage: JoinMessage = { teamId: id, secret, name: teamName };
		this.socket.emit(RealTimeEvent.JOIN, joinMessage);
		console.log("Join message sent", joinMessage);
	}

}
