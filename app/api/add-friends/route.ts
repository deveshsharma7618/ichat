import clientPromise from "@/lib/mongodb";
import { FriendModel } from "@/models/Friends";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("ichat");
    const friends = await db.collection("friends").find().toArray();
    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching friends" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, token, accessToken, friendEmail } = body;

    // Validation
    if (!email || !friendEmail) {
      console.error("Email and friend email are required");
      return NextResponse.json(
        { error: "Email and friend email are required" },
        { status: 400 },
      );
    }

    // Cannot add yourself as a friend
    if (email.toLowerCase() === friendEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "You cannot add yourself as a friend" },
        { status: 400 },
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db("ichat");
    if (accessToken) {
      // Verify access token with Google API
      const verifyUser = await db
        .collection("users")
        .findOne({ email: email.toLowerCase(), accessToken: accessToken });
      if (!verifyUser) {
        return NextResponse.json(
          { error: "Invalid email or token" },
          { status: 401 },
        );
      }
    } else if (token) {
      // For credentials-based login, we just check if the user exists
      const verifyUser = await db
        .collection("users")
        .findOne({ email: email.toLowerCase() });
      if (!verifyUser) {
        return NextResponse.json(
          { error: "Invalid email or token" },
          { status: 401 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 401 },
      );
    }

    // Find friend in users collection (without password and tokens)
    const friend = await db
      .collection("users")
      .findOne(
        { email: friendEmail.toLowerCase() },
        { projection: { password: 0, accessToken: 0, refreshToken: 0, tokenExpiry: 0 } }
      );

    if (!friend) {
      return NextResponse.json(
        { error: "Friend email does not exist" },
        { status: 400 },
      );
    }

    // Find user's friend document
    const userFriendDoc = await db
      .collection("friends")
      .findOne({ email: email.toLowerCase() });

    // Check if friend is already added
    if (userFriendDoc && userFriendDoc.friends) {
      const alreadyAdded = userFriendDoc.friends.some(
        (f: any) => f.email && f.email.toLowerCase() === friendEmail.toLowerCase()
      );
      
      if (alreadyAdded) {
        return NextResponse.json(
          { error: "Friend is already added" },
          { status: 409 },
        );
      }
    }

    // Prepare friend data (without sensitive fields)
    const friendData = {
      _id: friend._id,
      name: friend.name,
      email: friend.email,
      image: friend.image || null,
      provider: friend.provider || "credentials",
      createdAt: friend.createdAt,
    };

    // First time adding friend, create a new document for the user in the friends collection
    if (!userFriendDoc) {
      const newFriendDoc = {
        name: name,
        email: email.toLowerCase(),
        friends: [friendData],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("friends").insertOne(newFriendDoc);
      return NextResponse.json(
        { message: "Friend added successfully", friend: friendData },
        { status: 200 },
      );
    }

    // If user exists, add friend to their friends list
    const updatedFriends = [...(userFriendDoc.friends || []), friendData];
    await db
      .collection("friends")
      .updateOne(
        { email: email.toLowerCase() },
        { $set: { friends: updatedFriends, updatedAt: new Date() } },
      );
    
    return NextResponse.json(
      { message: "Friend added successfully", friend: friendData },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json(
      { error: "An error occurred while adding friend" },
      { status: 500 },
    );
  }
}
