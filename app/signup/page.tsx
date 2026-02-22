import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faGoogle,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

export default function SignUp() {
  return (
    <main className=" min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign up to get started with iChat</p>
        </div>
        
        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              placeholder="Enter your full name" 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required 
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="Enter your email" 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="Create a password" 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required 
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              placeholder="Confirm your password" 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required 
            />
          </div>
          
          <div className="flex items-start">
            <input 
              type="checkbox" 
              id="terms" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 cursor-pointer"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-200 transform hover:scale-[1.02] cursor-pointer"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
        <div className='mt-4 text-center flex flex-col items-center gap-3'>
          <button className='bg-blue-600 p-4 w-full rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-200 transform hover:scale-[1.02] cursor-pointer'>
            <FontAwesomeIcon icon={faGoogle} className='w-5 h-5 mr-2' />
            Continue with Google</button>
          <button className='ml-2 bg-gray-800 p-4 w-full rounded-lg flex items-center justify-center hover:bg-gray-700 transition duration-200 transform hover:scale-[1.02] cursor-pointer'>
            <FontAwesomeIcon icon={faGithub} className='w-5 h-5 mr-2' />
            Continue with Github</button>
          <button className='ml-2 bg-pink-600 p-4 w-full rounded-lg flex items-center justify-center hover:bg-pink-700 transition duration-200 transform hover:scale-[1.02] cursor-pointer'>
            <FontAwesomeIcon icon={faInstagram} className='w-5 h-5 mr-2' />
            Continue with Instagram</button>
        </div>
      </div>
    </main>
  );
}