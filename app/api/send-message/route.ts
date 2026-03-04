import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email ,token, friendEmail, message } = body;
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

        const friend = await db.collection('users').findOne({ email: friendEmail.toLowerCase() });
        if (!friend) {
            return NextResponse.json(
                { error: 'Friend not found' },
                { status: 404 }
            );
        }
        const chatsData = await db.collection('chats').findOne({ email: email.toLowerCase(), friendEmail: friendEmail.toLowerCase(), token: token });
        if(chatsData){
            await db.collection('chats').updateOne(
                { email: email.toLowerCase(), friendEmail: friendEmail.toLowerCase(), token: token },
                { $push: { messages: { sender_email: email.toLowerCase(), sender_name: user?.name || userUsingCreditionals?.name, message: message,friend_email : friendEmail,messageStatus : "sent", sendAt: new Date() } as any }, $set: { lastSend: new Date() } }
            );

            await db.collection('chats').updateOne(
                { email: friendEmail.toLowerCase(), friendEmail: email.toLowerCase(), token : friend.accessToken || friend.password },
                { $push: { messages: { sender_email: email.toLowerCase(), sender_name: user?.name || userUsingCreditionals?.name, message: message,friend_email : friendEmail,messageStatus : "sent", sendAt: new Date() } as any }, $set: { lastSend: new Date() } }
            );

        } else {
            await db.collection('chats').insertOne({
                email: email.toLowerCase(),
                friendEmail: friendEmail.toLowerCase(),
                token: token,
                messages: [{ sender_email: email.toLowerCase(), sender_name: user?.name || userUsingCreditionals?.name, friend_email: friendEmail, message: message, messageStatus: "sent", sendAt: new Date() }],
                lastSend: new Date()
            });

            await db.collection('chats').insertOne({
                email: friendEmail.toLowerCase(),
                friendEmail: email.toLowerCase(),
                token: friend.accessToken || friend.password,
                messages: [{ sender_email: email.toLowerCase(), sender_name: user?.name || userUsingCreditionals?.name, friend_email: friendEmail, message: message, messageStatus: "sent", sendAt: new Date() }],
                lastSend: new Date()
            });

        }
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    }
        catch (error) {
            console.error('Error sending message:', error);
            return NextResponse.json(
                { error: 'Internal Server Error' },
                { status: 500 }
            );
        }
}