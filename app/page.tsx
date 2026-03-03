"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useClientAuth } from "@/lib/client-auth";
import LoginForm from "@/app/components/auth/LoginForm";
import OAuthButtons from "@/app/components/auth/OAuthButtons";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, isLoading, isAuthenticated } = useClientAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (isLoading || hasRedirected) {
      return;
    }

    if (isAuthenticated && user?.email) {
      console.log("User is authenticated:", user);
      setHasRedirected(true);
      window.location.href = "/chat"; // Redirect to chat page
    }
  }, [isLoading, isAuthenticated, user, hasRedirected]);

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (isAuthenticated) {
    return <LoadingSpinner text="Redirecting..." />;
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/chat",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Handle error (e.g., show error message to user)
    } finally {
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signIn("github", {
        redirect: true,
        callbackUrl: "/chat",
      });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      // Handle error (e.g., show error message to user)
    } finally {
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formData = { email, password };
    const response = fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Login response:", data);

        if (data.user && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/chat"; // Redirect to chat page after successful login
        } else {
          console.error("Login failed:", data.error || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Handle login error (e.g., show error message)
      });
  };

  return (
    <main className="py-10 min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to iChat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        <LoginForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>

        <OAuthButtons
          onGoogleSignIn={handleGoogleSignIn}
          onGithubSignIn={handleGithubSignIn}
        />
      </div>
    </main>
  );
}
