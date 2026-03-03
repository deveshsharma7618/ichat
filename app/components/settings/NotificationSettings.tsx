import SettingsToggle from "./SettingsToggle";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  onToggleEmail: () => void;
  onTogglePush: () => void;
  onToggleMessage: () => void;
}

export default function NotificationSettings({
  emailNotifications,
  pushNotifications,
  messageNotifications,
  onToggleEmail,
  onTogglePush,
  onToggleMessage,
}: NotificationSettingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Notification Settings
      </h2>
      <div className="space-y-4">
        <SettingsToggle
          label="Email Notifications"
          description="Receive notifications via email"
          isEnabled={emailNotifications}
          onToggle={onToggleEmail}
          withBackground
        />

        <SettingsToggle
          label="Push Notifications"
          description="Receive push notifications on your device"
          isEnabled={pushNotifications}
          onToggle={onTogglePush}
          withBackground
        />

        <SettingsToggle
          label="Message Notifications"
          description="Get notified when you receive new messages"
          isEnabled={messageNotifications}
          onToggle={onToggleMessage}
          withBackground
        />
      </div>
    </div>
  );
}
