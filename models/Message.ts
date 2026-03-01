import { Db, ObjectId } from 'mongodb';

export interface Message {
  _id?: ObjectId;
  sender_name: string;
  sender_email: string;
  token ?: string;
  message : string;
  friend_email ?: string;
  messageStatus ?: 'sent' | 'delivered' | 'seen';
  sendAt?: Date;
  updatedAt?: Date;
}

export class MessageModel    {
  private db: Db;
    friends: any;

  constructor(db: Db) {
    this.db = db;
  }
}
