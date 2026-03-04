import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, token, friendEmail } = body;
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }
        const client = await clientPromise;
        const db = client.db('ichat');
        const user = await db.collection('users').findOne({ email: email.toLowerCase(), accessToken: token });
        const userUsingCreditionals = await db.collection('users').findOne({ email: email.toLowerCase(), password: token });
        if (!user && !userUsingCreditionals) {
            return NextResponse.json(
                { error: 'User not found or invalid token' },
                { status: 404 }
            );
        }
        const chatsData = await db.collection('chats').find({ email: email.toLowerCase(), friendEmail: friendEmail.toLowerCase()});
        const chatsArray = await chatsData.toArray();
        const allMessages = chatsArray.reduce((acc, chat) => {
            return acc.concat(chat.messages);
        }, []);
         return NextResponse.json(
            { chats: allMessages },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching chats:', error);  
        return NextResponse.json(
            { chats: [] },
            { status: 500 }
        );  
    } 
}