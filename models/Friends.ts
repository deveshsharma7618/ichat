import { Db, ObjectId } from 'mongodb';
import { UserWithoutPassword } from './User';

export interface Friends {
  _id?: ObjectId;
  name: string;
  email: string;
  unread_messages ?: number | 0;
  friends ?: UserWithoutPassword[]; // Array of friend user IDs
  createdAt?: Date;
  updatedAt?: Date;

}

export class FriendModel {
  private db: Db;
    friends: any;

  constructor(db: Db) {
    this.db = db;
  }

  async findUserByEmail(email: string): Promise<FriendModel | null> {
    const user = await this.db.collection('friends').findOne({ email: email.toLowerCase() }) as FriendModel | null;
    return user;
  }

  // Find user by id (without password)
  async findUserById(id: string | ObjectId): Promise<FriendModel | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const user = await this.db.collection('friends').findOne(
      { _id: objectId },
      { projection: { password: 0 } }
    ) as FriendModel | null;
    return user;
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.db.collection('friends').countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }
}
