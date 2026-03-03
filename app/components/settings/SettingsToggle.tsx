import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

interface SettingsToggleProps {
  label: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
  withBackground?: boolean;
}

export default function SettingsToggle({
  label,
  description,
  isEnabled,
  onToggle,
  withBackground = false,
}: SettingsToggleProps) {
  const containerClass = withBackground
    ? "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
    : "flex items-center justify-between";

  return (
    <div className={containerClass}>
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button onClick={onToggle} className="text-3xl transition duration-200">
        <FontAwesomeIcon
          icon={isEnabled ? faToggleOn : faToggleOff}
          className={isEnabled ? "text-green-600" : "text-gray-400"}
        />
      </button>
    </div>
  );
}
