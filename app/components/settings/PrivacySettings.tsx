import SettingsToggle from "./SettingsToggle";

interface PrivacySettingsProps {
  profileVisibility: string;
  allowMessages: string;
  showOnlineStatus: boolean;
  allowReadReceipts: boolean;
  activityStatus: boolean;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onToggleOnlineStatus: () => void;
  onToggleReadReceipts: () => void;
  onToggleActivityStatus: () => void;
}

export default function PrivacySettings({
  profileVisibility,
  allowMessages,
  showOnlineStatus,
  allowReadReceipts,
  activityStatus,
  onSelectChange,
  onToggleOnlineStatus,
  onToggleReadReceipts,
  onToggleActivityStatus,
}: PrivacySettingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Privacy Settings
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="profileVisibility"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Profile Visibility
          </label>
          <select
            id="profileVisibility"
            name="profileVisibility"
            value={profileVisibility}
            onChange={onSelectChange}
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
          >
            <option>Public</option>
            <option>Private</option>
            <option>Friends Only</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Choose who can see your profile information
          </p>
        </div>

        <div>
          <label
            htmlFor="allowMessages"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Who Can Message You
          </label>
          <select
            id="allowMessages"
            name="allowMessages"
            value={allowMessages}
            onChange={onSelectChange}
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
          >
            <option>Everyone</option>
            <option>Friends Only</option>
            <option>No One</option>
          </select>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <SettingsToggle
            label="Show Online Status"
            description="Let others see when you're online"
            isEnabled={showOnlineStatus}
            onToggle={onToggleOnlineStatus}
          />

          <SettingsToggle
            label="Allow Read Receipts"
            description="Show when you've read messages"
            isEnabled={allowReadReceipts}
            onToggle={onToggleReadReceipts}
          />

          <SettingsToggle
            label="Activity Status"
            description="Show your activity status"
            isEnabled={activityStatus}
            onToggle={onToggleActivityStatus}
          />
        </div>
      </div>
    </div>
  );
}
