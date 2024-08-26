import { Message } from "./message.model";

export interface Conversation {
    id: string;
    roomId: string;
    peerOneId: string;
    peerOne: User;
    peerTwoId: string;
    peerTwo: User;
    isBlocked: boolean;
    blockerId?: string;
    lastActivityTimestamp: Date;
    messages?:Message[]
  }
  
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  }