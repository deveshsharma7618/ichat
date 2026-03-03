import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

interface FormData {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileEditFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  formData,
  onInputChange,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Edit Profile Information
      </h3>
      <form className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={onInputChange}
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={onInputChange}
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
