import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface ProfileData {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileCardProps {
  profileData: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
}

export default function ProfileCard({ profileData, isEditing, onEditToggle }: ProfileCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          {profileData.avatar ? (
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-32 h-32 rounded-full border-4 border-blue-600 dark:border-blue-400"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-blue-600 dark:border-blue-400 flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-3xl font-bold">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
          )}
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition duration-200">
              <FontAwesomeIcon icon={faCamera} className="w-4 h-4" />
            </button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {profileData.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
      </div>

      {!isEditing && (
        <button
          onClick={onEditToggle}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 mb-4"
        >
          Edit Profile
        </button>
      )}

      <Link href="/chat">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200">
          Start Chatting
        </button>
      </Link>
    </div>
  );
}
