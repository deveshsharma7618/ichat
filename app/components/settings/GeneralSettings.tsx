interface GeneralSettingsProps {
  language: string;
  timezone: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function GeneralSettings({ language, timezone, onSelectChange }: GeneralSettingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        General Settings
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Language
          </label>
          <select
            id="language"
            name="language"
            value={language}
            onChange={onSelectChange}
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Chinese</option>
            <option>Japanese</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={timezone}
            onChange={onSelectChange}
            className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
          >
            <option>Pacific Time (PT)</option>
            <option>Eastern Time (ET)</option>
            <option>Central Time (CT)</option>
            <option>Mountain Time (MT)</option>
            <option>GMT</option>
            <option>CET</option>
            <option>IST</option>
          </select>
        </div>
      </div>
    </div>
  );
}
