import Link from 'next/link'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faComments, faUser, faCog, faRightFromBracket, faMessage } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
              <FontAwesomeIcon icon={faMessage} className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              iChat
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg group-hover:scale-110 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              href="/chat" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
            >
              <FontAwesomeIcon icon={faComments} className="text-lg group-hover:scale-110 transition-transform" />
              <span className="font-medium">Chats</span>
            </Link>
            
            <Link 
              href="/profile" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
            >
              <FontAwesomeIcon icon={faUser} className="text-lg group-hover:scale-110 transition-transform" />
              <span className="font-medium">Profile</span>
            </Link>
            
            <Link 
              href="/settings" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
            >
              <FontAwesomeIcon icon={faCog} className="text-lg group-hover:scale-110 transition-transform" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            {/* User Avatar Placeholder */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <span>JD</span>
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              title="Logout"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <nav className="flex items-center justify-around py-2 px-2">
          <Link 
            href="/" 
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="text-xl" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link 
            href="/chat" 
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faComments} className="text-xl" />
            <span className="text-xs font-medium">Chats</span>
          </Link>
          
          <Link 
            href="/profile" 
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faUser} className="text-xl" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
          
          <Link 
            href="/settings" 
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faCog} className="text-xl" />
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
