export interface ChatDraws {
  dotX: number;
  dotY: number;
}

export interface IncomingChatMessage {
  type: string;
  payload: ChatDraws;
}

export interface IncomingWelcomeMessage{
  type: 'WELCOME';
  payload: string;
}

export type IncomingDraws = IncomingChatMessage | IncomingWelcomeMessage;