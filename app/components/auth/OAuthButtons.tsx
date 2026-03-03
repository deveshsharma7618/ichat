import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle, faInstagram } from "@fortawesome/free-brands-svg-icons";

interface OAuthButtonsProps {
  onGoogleSignIn: () => void;
  onGithubSignIn: () => void;
}

export default function OAuthButtons({ onGoogleSignIn, onGithubSignIn }: OAuthButtonsProps) {
  return (
    <div className="mt-4 text-center flex flex-col items-center gap-3">
      <button
        onClick={onGoogleSignIn}
        className="bg-blue-600 p-4 w-full rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-200 transform hover:scale-[1.02] cursor-pointer"
      >
        <FontAwesomeIcon icon={faGoogle} className="w-5 h-5 mr-2" />
        Continue with Google
      </button>
      <button
        onClick={onGithubSignIn}
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
  );
}
