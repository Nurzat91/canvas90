export interface ChatDraws {
  dotX: number;
  dotY: number;
}

export interface IncomingChatMessage {
  type: string;
  payload: ChatDraws;
}
