import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySettingsProps {
  passwordData: PasswordData;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function SecuritySettings({
  passwordData,
  onPasswordChange,
  onSubmit,
}: SecuritySettingsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-600">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faLock} className="w-5 h-5" />
        Security Settings
      </h3>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            value={passwordData.currentPassword}
            onChange={onPasswordChange}
            placeholder="Enter your current password"
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={onPasswordChange}
              placeholder="Enter new password"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={onPasswordChange}
              placeholder="Confirm new password"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
