import { Db, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWithoutPassword {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserModel {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Create user
  async createUser(name: string, email: string, password: string): Promise<UserWithoutPassword> {
    const hashedPassword = await this.hashPassword(password);
    const user: User = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.db.collection('users').insertOne(user);
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      _id: result.insertedId,
    } as UserWithoutPassword;
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.db.collection('users').findOne({ email: email.toLowerCase() }) as User | null;
    return user;
  }

  // Find user by id (without password)
  async findUserById(id: string | ObjectId): Promise<UserWithoutPassword | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const user = await this.db.collection('users').findOne(
      { _id: objectId },
      { projection: { password: 0 } }
    ) as UserWithoutPassword | null;
    return user;
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    const count = await this.db.collection('users').countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }
}
