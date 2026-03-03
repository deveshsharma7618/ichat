import { getServerSession } from "next-auth/next";
import { AUTH_OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

/**
 * Get current user session with OAuth tokens
 */
export async function getCurrentUserSession() {
  const session = await getServerSession(AUTH_OPTIONS);
  return session;
}

/**
 * Get authenticated user's email from server session
 */
export async function getAuthenticatedUserEmail() {
  const session = await getCurrentUserSession();
  return session?.user?.email ?? null;
}

/**
 * Get user data from database with tokens
 */
export async function getUserWithTokens(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db("ichat");
    
    const user = await db.collection("users").findOne(
      { email },
      { projection: { password: 0 } }
    );
    
    return user;
  } catch (error) {
    console.error("Error fetching user with tokens:", error);
    return null;
  }
}

/**
 * Get OAuth access token for API calls
 */
export async function getOAuthAccessToken(email: string) {
  try {
    const user = await getUserWithTokens(email);
    
    if (!user) {
      return null;
    }

    // Check if token is expired
    if (user.tokenExpiry && user.tokenExpiry * 1000 < Date.now()) {
      console.warn("Access token expired for user:", email);
      // Note: Token refresh would require additional implementation
      return null;
    }

    return {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      provider: user.provider,
      expiresAt: user.tokenExpiry,
    };
  } catch (error) {
    console.error("Error getting OAuth access token:", error);
    return null;
  }
}

/**
 * Get user profile data from database
 */
export async function getUserProfile(email: string) {
  try {
    const user = await getUserWithTokens(email);
    
    if (!user) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Check if user is OAuth authenticated
 */
export async function isOAuthUser(email: string): Promise<boolean> {
  try {
    const user = await getUserWithTokens(email);
    return !!(user && user.provider && user.accessToken);
  } catch (error) {
    console.error("Error checking OAuth user:", error);
    return false;
  }
}
