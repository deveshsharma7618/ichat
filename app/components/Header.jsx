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
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useClientAuth, handleLogout } from "@/lib/client-auth";

const Header = () => {
  const { user, isAuthenticated } = useClientAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Full-screen backdrop overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black dark:bg-black bg-opacity-50 dark:bg-opacity-60 z-40 transition-opacity duration-300 ease-out md:hidden"
          onClick={closeMobileMenu}
          style={{
            animation: "fadeIn 0.3s ease-out",
          }}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .menu-item {
          animation: slideInFromLeft 0.3s ease-out forwards;
        }

        .menu-item:nth-child(1) {
          animation-delay: 0.05s;
        }

        .menu-item:nth-child(2) {
          animation-delay: 0.1s;
        }

        .menu-item:nth-child(3) {
          animation-delay: 0.15s;
        }

        .menu-item:nth-child(4) {
          animation-delay: 0.2s;
        }

        .menu-item:nth-child(5) {
          animation-delay: 0.25s;
        }
      `}</style>

    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
              <FontAwesomeIcon
                icon={faMessage}
                className="text-white text-lg sm:text-xl"
              />
            </div>
            <span className="hidden sm:inline text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              iChat
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated && (
              <>
                <Link
                  href="/chat"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group${activeTab === "chat" ? " bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => setActiveTab("chat")}    
                >
                  <FontAwesomeIcon
                    icon={faComments}
                    className="text-base group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium text-sm">Chats</span>
                </Link>

                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group${activeTab === "profile" ? " bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-base group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium text-sm">Profile</span>
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group${activeTab === "settings" ? " bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    className="text-base group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium text-sm">Settings</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-base" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faTimes : faBars}
              className="text-xl"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed top-16 left-0 right-0 bottom-0 bg-white dark:bg-gray-900 md:hidden overflow-y-auto z-40 transform origin-top"
            style={{
              animation: "slideDown 0.4s ease-out",
            }}
          >
            <div className="pl-0">
              {isAuthenticated && (
                <>
                  <Link
                    href="/chat"
                    className={`menu-item flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-l-4 ${activeTab === "chat" ? "border-blue-600 bg-gray-50 dark:bg-gray-800" : "border-transparent"}`}
                    onClick={() => {
                      setActiveTab("chat");
                      closeMobileMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faComments} className="text-lg" />
                    <span className="font-medium">Chats</span>
                  </Link>

                  <Link
                    href="/profile"
                    className={`menu-item flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-l-4 ${activeTab === "profile" ? "border-blue-600 bg-gray-50 dark:bg-gray-800" : "border-transparent"}`}
                    onClick={() => {
                      setActiveTab("profile");
                      closeMobileMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="text-lg" />
                    <span className="font-medium">Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    className={`menu-item flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-l-4 ${activeTab === "settings" ? "border-blue-600 bg-gray-50 dark:bg-gray-800" : "border-transparent"}`}
                    onClick={() => {
                      setActiveTab("settings");
                      closeMobileMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faCog} className="text-lg" />
                    <span className="font-medium">Settings</span>
                  </Link>

                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="menu-item w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 hover:text-red-600 dark:hover:text-red-400 transition-all border-l-4 border-transparent"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    href="/"
                    className="menu-item flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-l-4 border-transparent"
                    onClick={closeMobileMenu}
                  >
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="menu-item flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all border-l-4 border-blue-700"
                    onClick={closeMobileMenu}
                  >
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;
