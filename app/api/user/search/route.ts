import { UserWithoutPassword } from "@/models/User";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("email") || "";
    const currentUserEmail = (searchParams.get("currentUserEmail") || "").toLowerCase();
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }
    const client = await clientPromise;
    const db = client.db("ichat");
    const alreadyAddedFriends = await db
      .collection("friends")
      .findOne({ email: currentUserEmail });
    const users = (await db
      .collection("users")
      .find({
        email: { $regex: `^${query}`, $options: "i" }, // Case-insensitive search for emails starting with the query string
      })
      .project({ password: 0 })
      .toArray()) as UserWithoutPassword[];
    const filteredUsers : any = users.filter((user) => {
        if (currentUserEmail && user.email?.toLowerCase() === currentUserEmail) {
            return false;
        }
        if (alreadyAddedFriends) {
            return !alreadyAddedFriends.friends.some(
                (friend : any) => friend.email === user.email
            );
        }
        return true;
    });
    return NextResponse.json(
      { users: filteredUsers, alreadyAddedFriends },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "An error occurred while searching for users" },
      { status: 500 },
    );
  }
}
