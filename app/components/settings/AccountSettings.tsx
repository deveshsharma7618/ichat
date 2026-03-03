import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import SettingsToggle from "./SettingsToggle";

interface AccountSettingsProps {
  email: string;
  twoFactor: boolean;
  onToggleTwoFactor: () => void;
}

export default function AccountSettings({ email, twoFactor, onToggleTwoFactor }: AccountSettingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Account Settings
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-2">
            Email cannot be changed directly. Contact support for email changes.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
            Security
          </h3>

          <div className="mb-4">
            <SettingsToggle
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              isEnabled={twoFactor}
              onToggle={onToggleTwoFactor}
            />
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
