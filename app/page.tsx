"use client";
import {
  faGithub,
  faGoogle,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run after component is mounted to avoid hydration mismatch
    if (!isMounted) return;

    // Only redirect if user is authenticated and we haven't already redirected
    if (status === 'authenticated' && session?.user && !hasRedirected) {
      console.log("User is authenticated:", session.user);
      const user = JSON.stringify(session.user);
      console.log("Storing user in localStorage:", user);
      localStorage.setItem("user", user);
      setHasRedirected(true);
      window.location.href = "/chat"; // Redirect to chat page
      return;
    }

    // Only check localStorage if not authenticated and haven't redirected yet
    if (status !== 'authenticated' && !hasRedirected) {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.email) {
            console.log("User found in localStorage, redirecting to chat...");
            setHasRedirected(true);
            window.location.href = "/chat";
          }
        }
      } catch (e) {
        console.error("Error parsing localStorage:", e);
      }
    }
    
  }, [isMounted, session, status, hasRedirected]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (status === 'authenticated') {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/chat"; // Redirect to chat page after successful login
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-200 transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>

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

        <div className="mt-4 text-center flex flex-col items-center gap-3">
          <button onClick={handleGoogleSignIn} className="bg-blue-600 p-4 w-full rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-200 transform hover:scale-[1.02] cursor-pointer">
            <FontAwesomeIcon icon={faGoogle} className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
          <button
            onClick={handleGithubSignIn}
            className="ml-2 bg-gray-800 p-4 w-full rounded-lg flex items-center justify-center hover:bg-gray-700 transition duration-200 transform hover:scale-[1.02] cursor-pointer"
          >
            <FontAwesomeIcon icon={faGithub} className="w-5 h-5 mr-2" />
            Continue with Github
          </button>
          <button className="ml-2 bg-pink-600 p-4 w-full rounded-lg flex items-center justify-center hover:bg-pink-700 transition duration-200 transform hover:scale-[1.02] cursor-pointer">
            <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 mr-2" />
            Continue with Instagram
          </button>
        </div>
      </div>
    </main>
  );
}
