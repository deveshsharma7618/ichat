import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { newName, email, accessToken } = await request.json();

    const db = (await clientPromise).db("ichat");
    const user = await db.collection("users").findOne({ email });
    console.log(newName, email, accessToken);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("User found:", user);
    

    if (user.accessToken !== accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.collection("users").updateOne(
      { email },
      { $set: { name: newName, updatedAt: new Date() } }
    );

    const updatedUser = await db.collection("users").findOne({ email });
    console.log("Updated user:", updatedUser);



    return NextResponse.json({ message: `Name changed to ${newName}`, newName });
  } catch (error) {
    console.error("Error changing name:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
