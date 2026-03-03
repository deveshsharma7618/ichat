import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface SettingsTab {
  id: string;
  label: string;
  icon: IconDefinition;
}

interface SettingsTabsProps {
  tabs: SettingsTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function SettingsTabs({ tabs, activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 h-fit sticky top-8">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`hover:cursor-pointer w-full text-left px-4 py-3 rounded-lg transition duration-200 flex items-center gap-3 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
