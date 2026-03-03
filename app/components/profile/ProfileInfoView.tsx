import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";

interface ProfileData {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileInfoViewProps {
  profileData: ProfileData;
}

export default function ProfileInfoView({ profileData }: ProfileInfoViewProps) {
  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Profile Information
      </h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <span className="text-gray-600 dark:text-gray-400 font-semibold w-32 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
            Name:
          </span>
          <span className="text-gray-800 dark:text-white">{profileData.name}</span>
        </div>
        <div className="flex items-start">
          <span className="text-gray-600 dark:text-gray-400 font-semibold w-32 flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
            Email:
          </span>
          <span className="text-gray-800 dark:text-white">{profileData.email}</span>
        </div>
      </div>
    </>
  );
}
