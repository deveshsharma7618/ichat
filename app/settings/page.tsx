'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faBell,
  faPalette,
  faGlobe,
  faDatabase,
  faSave,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useClientAuth } from '@/lib/client-auth';
import SettingsTabs from '@/app/components/settings/SettingsTabs';
import AccountSettings from '@/app/components/settings/AccountSettings';
import PrivacySettings from '@/app/components/settings/PrivacySettings';
import NotificationSettings from '@/app/components/settings/NotificationSettings';
import AppearanceSettings from '@/app/components/settings/AppearanceSettings';
import GeneralSettings from '@/app/components/settings/GeneralSettings';
import DataPrivacySettings from '@/app/components/settings/DataPrivacySettings';
import LoadingSpinner from '@/app/components/shared/LoadingSpinner';

// Default settings
const DEFAULT_SETTINGS = {
  email : "",
  phone: '',
  language: 'English',
  timezone: 'Eastern Time (ET)',
  emailNotifications: true,
  pushNotifications: true,
  messageNotifications: true,
  profileVisibility: 'Public',
  allowMessages: 'Everyone',
  showOnlineStatus: true,
  allowReadReceipts: true,
  twoFactor: false,
  activityStatus: true,
  darkMode: false,
};

export default function Settings() {
  const { user, isLoading: authLoading, isAuthenticated } = useClientAuth({ requireAuth: true });
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Initialize settings from localStorage and fetch user data
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    loadSettings(user?.email || '');
  }, [authLoading, isAuthenticated, user?.email]);

  // Apply dark mode setting to document
  useEffect(() => {
    if (authLoading) return;
    
    const htmlElement = document.documentElement;
    if (settings.darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [settings.darkMode, authLoading]);

  // Load settings from localStorage
  const loadSettings = async (email: string) => {
    try {
      // Try to get settings from localStorage first
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings({ ...JSON.parse(savedSettings), email });
      } else {
        // If no saved settings, initialize with defaults
        localStorage.setItem('userSettings', JSON.stringify({ ...DEFAULT_SETTINGS, email }));
      }

      // Fetch user data from API if authenticated
      if (email) {
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Fallback to defaults if localStorage fails
      setSettings({ ...DEFAULT_SETTINGS, email });
    } finally {
      setIsPageLoading(false);
    }
  };

  // Fetch user profile data from API
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userData = await response.json();
        // Merge API data with localStorage settings
        const mergedSettings = {
          ...settings,
          email: userData.email || settings.email,
          phone: userData.phone || settings.phone,
        };
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (authLoading || isPageLoading) {
    return <LoadingSpinner text="Loading settings..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    setUnsavedChanges(true);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Optional: Send settings to API for server-side storage
      try {
        await fetch('/api/user/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        });
      } catch (error) {
        console.warn('Could not save settings to server, but saved locally:', error);
      }

      setUnsavedChanges(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  const handleExportData = () => {
    // Handle data export
    alert('Data export initiated. Check your email for the download link.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      alert('Account deletion initiated. Please check your email for confirmation.');
    }
  };

  const settingsTabs = [
    { id: 'account', label: 'Account', icon: faUser },
    { id: 'privacy', label: 'Privacy', icon: faLock },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'appearance', label: 'Appearance', icon: faPalette },
    { id: 'general', label: 'General', icon: faGlobe },
    { id: 'data', label: 'Data & Privacy', icon: faDatabase },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition duration-200">
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
          </div>
          {unsavedChanges && (
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <SettingsTabs
              tabs={settingsTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <AccountSettings
                  email={settings.email}
                  twoFactor={settings.twoFactor}
                  onToggleTwoFactor={() => handleToggle('twoFactor')}
                />
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <PrivacySettings
                  profileVisibility={settings.profileVisibility}
                  allowMessages={settings.allowMessages}
                  showOnlineStatus={settings.showOnlineStatus}
                  allowReadReceipts={settings.allowReadReceipts}
                  activityStatus={settings.activityStatus}
                  onSelectChange={handleSelectChange}
                  onToggleOnlineStatus={() => handleToggle('showOnlineStatus')}
                  onToggleReadReceipts={() => handleToggle('allowReadReceipts')}
                  onToggleActivityStatus={() => handleToggle('activityStatus')}
                />
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <NotificationSettings
                  emailNotifications={settings.emailNotifications}
                  pushNotifications={settings.pushNotifications}
                  messageNotifications={settings.messageNotifications}
                  onToggleEmail={() => handleToggle('emailNotifications')}
                  onTogglePush={() => handleToggle('pushNotifications')}
                  onToggleMessage={() => handleToggle('messageNotifications')}
                />
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <AppearanceSettings
                  darkMode={settings.darkMode}
                  onThemeChange={(isDark) => {
                    setSettings({ ...settings, darkMode: isDark });
                    setUnsavedChanges(true);
                  }}
                />
              )}

              {/* General Settings */}
              {activeTab === 'general' && (
                <GeneralSettings
                  language={settings.language}
                  timezone={settings.timezone}
                  onSelectChange={handleSelectChange}
                />
              )}

              {/* Data & Privacy Settings */}
              {activeTab === 'data' && (
                <DataPrivacySettings
                  onExportData={handleExportData}
                  onDeleteAccount={handleDeleteAccount}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
