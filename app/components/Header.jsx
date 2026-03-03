"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faUser,
  faCog,
  faRightFromBracket,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useClientAuth, handleLogout } from "@/lib/client-auth";

const Header = () => {
  const { user, isAuthenticated } = useClientAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const avatarUrl = user?.image || "";

  useEffect(() => {
    // Set active tab based on current URL path
    const path = window.location.pathname;
    if (path.startsWith("/chat")) {
      setActiveTab("chat");
    }
    else if (path.startsWith("/profile")) {
      setActiveTab("profile");
    }
    else if (path.startsWith("/settings")) {
      setActiveTab("settings");
    } else {
      setActiveTab("");
    }
  }, []);

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
              <FontAwesomeIcon
                icon={faMessage}
                className="text-white text-xl"
              />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              iChat
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated && (
              <>
                <Link
                  href="/chat"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group${activeTab === "chat" ? " bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => setActiveTab("chat")}    
                >
                  <FontAwesomeIcon
                    icon={faComments}
                    className="text-lg group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">Chats</span>
                </Link>

                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group${activeTab === "profile" ? " bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-lg group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">Profile</span>
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group${activeTab === "settings" ? " bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    className="text-lg group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">Settings</span>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
              )}
            </div>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="text-lg"
                />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
