import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

interface AppearanceSettingsProps {
  darkMode: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export default function AppearanceSettings({ darkMode, onThemeChange }: AppearanceSettingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Appearance Settings
      </h2>
      <div className="space-y-6">
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-4">Theme</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onThemeChange(false)}
              className={`p-4 rounded-lg border-2 transition duration-200 flex flex-col items-center gap-2 ${
                !darkMode
                  ? "border-blue-600 bg-blue-50 dark:bg-gray-700"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <FontAwesomeIcon icon={faSun} className="w-8 h-8 text-yellow-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Light</span>
            </button>
            <button
              onClick={() => onThemeChange(true)}
              className={`p-4 rounded-lg border-2 transition duration-200 flex flex-col items-center gap-2 ${
                darkMode
                  ? "border-blue-600 bg-blue-50 dark:bg-gray-700"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <FontAwesomeIcon icon={faMoon} className="w-8 h-8 text-indigo-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Dark</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
