import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";

interface DataPrivacySettingsProps {
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export default function DataPrivacySettings({ onExportData, onDeleteAccount }: DataPrivacySettingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Data & Privacy
      </h2>
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            We take your privacy seriously. Your data is encrypted and stored securely. You can
            download or delete your data at any time.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Data Export
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download a copy of your data in JSON format. This includes your profile information,
            messages, and settings.
          </p>
          <button
            onClick={onExportData}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
            Export My Data
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Deleting your account is permanent and cannot be undone. All your data will be removed
            from our servers.
          </p>
          <button
            onClick={onDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
