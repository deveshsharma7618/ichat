import { Db, ObjectId } from 'mongodb';
import { Message } from './Message';
import { UserWithoutPassword } from './User';

export interface Chat {
  _id?: ObjectId;
  name: string;
  email: string;
  token ?: string;
  messages : Message[]; 
  friendEmail ?: string;
  lastSend?: Date;
  lastSeen?: Date;
}

export class ChatModel {
  private db: Db;
    chats: any;
  constructor(db: Db) {
    this.db = db;
  }
}
