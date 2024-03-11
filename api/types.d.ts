import {WebSocket} from 'ws';
export interface ActiveConnections {
  [id: string]: WebSocket
}

export interface IncomingMessage {
  type: string;
  payload: string | Draws[];
}

export interface Draws{
  dotX: number;
  dotY: number;
}
