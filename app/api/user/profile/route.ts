import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUserEmail } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const email = await getAuthenticatedUserEmail();

    if (!email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ichat");

    // Get user with all OAuth data and tokens
    const user = await db.collection("users").findOne(
      { email },
      { 
        projection: { 
          password: 0,
          accessToken: 1,
          refreshToken: 1,
          tokenExpiry: 1,
          provider: 1,
          name: 1,
          email: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      }
    );

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        hasAccessToken: !!user.accessToken,
        hasRefreshToken: !!user.refreshToken,
        tokenExpiresAt: user.tokenExpiry ? new Date(user.tokenExpiry * 1000) : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      // Only return tokens if specifically requested and validated
      tokens: {
        accessToken: user.accessToken || null,
        refreshToken: user.refreshToken || null,
        expiresAt: user.tokenExpiry,
        provider: user.provider,
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
