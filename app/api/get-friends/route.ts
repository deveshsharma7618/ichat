import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { FriendModel } from '@/models/Friends';
import { UserWithoutPassword } from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        
        const body = await request.json();
        const { email, token , accessToken } = body; 

        // Validate email
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('ichat');
        let user;

        // Try to verify with accessToken first (OAuth)
        if (accessToken) {
            const verifyUser = await db.collection('users').findOne({ 
                email: email.toLowerCase(), 
                accessToken: accessToken 
            }) as UserWithoutPassword;
            
            if (!verifyUser) {
                return NextResponse.json(
                    { error: 'Invalid email or token' },
                    { status: 401 }
                );
            }
            user = verifyUser;
        } 
        // Then try credential token
        else if (token) {
            const verifyUser = await db.collection('users').findOne({ 
                email: email.toLowerCase() 
            }) as UserWithoutPassword;
            
            if (!verifyUser) {
                return NextResponse.json(
                    { error: 'Invalid email or token' },
                    { status: 401 }
                );
            }
            user = verifyUser;
        } 
        // Finally, just verify user exists (for credentials without token)
        else {
            const verifyUser = await db.collection('users').findOne({ 
                email: email.toLowerCase() 
            }) as UserWithoutPassword;
            
            if (!verifyUser) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 401 }
                );
            }
            user = verifyUser;
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or token' },
                { status: 401 }
            );
        }
    
        // Fetch friends list for the user
        const friendsData = await db.collection('friends').findOne({ email: email.toLowerCase() });

        // Return properly structured response
        return NextResponse.json(
            { 
                success: true,
                friends: friendsData?.friends || [],
                message: 'Friends retrieved successfully'
            }, 
            { status: 200 }
        );
    }
    catch (error) {
        console.error('Error fetching friends:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching friends' },
            { status: 500 }
        );
    }
}
