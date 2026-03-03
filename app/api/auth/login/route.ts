import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'deveshSharmaSecretKey';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('ichat');
    const userModel = new UserModel(db);

    // Find user by email
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    const isPasswordValid = await userModel.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id!.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id!.toString(),
          name: user.name,
          email: user.email,
        },
        token: user.password,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
