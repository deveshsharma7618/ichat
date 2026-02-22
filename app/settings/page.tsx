'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faBell,
  faPalette,
  faGlobe,
  faDatabase,
  faToggleOn,
  faToggleOff,
  faSave,
  faArrowLeft,
  faMoon,
  faSun,
  faDownload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
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
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
    setUnsavedChanges(true);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    setUnsavedChanges(false);
    // Here you would typically send the settings to your backend
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 h-fit sticky top-8">
              <nav className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={settings.email}
                        disabled
                        className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-2">Email cannot be changed directly. Contact support for email changes.</p>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={settings.phone}
                        disabled
                        className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-2">Update your phone number in your profile settings.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
                        Security
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          onClick={() => handleToggle('twoFactor')}
                          className="text-3xl transition duration-200"
                        >
                          <FontAwesomeIcon
                            icon={settings.twoFactor ? faToggleOn : faToggleOff}
                            className={settings.twoFactor ? 'text-green-600' : 'text-gray-400'}
                          />
                        </button>
                      </div>

                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Privacy Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        id="profileVisibility"
                        name="profileVisibility"
                        value={settings.profileVisibility}
                        onChange={handleSelectChange}
                        className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                      >
                        <option>Public</option>
                        <option>Private</option>
                        <option>Friends Only</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">Choose who can see your profile information</p>
                    </div>

                    <div>
                      <label htmlFor="allowMessages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Who Can Message You
                      </label>
                      <select
                        id="allowMessages"
                        name="allowMessages"
                        value={settings.allowMessages}
                        onChange={handleSelectChange}
                        className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                      >
                        <option>Everyone</option>
                        <option>Friends Only</option>
                        <option>No One</option>
                      </select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Show Online Status</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Let others see when you're online</p>
                        </div>
                        <button
                          onClick={() => handleToggle('showOnlineStatus')}
                          className="text-3xl transition duration-200"
                        >
                          <FontAwesomeIcon
                            icon={settings.showOnlineStatus ? faToggleOn : faToggleOff}
                            className={settings.showOnlineStatus ? 'text-green-600' : 'text-gray-400'}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Allow Read Receipts</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Show when you've read messages</p>
                        </div>
                        <button
                          onClick={() => handleToggle('allowReadReceipts')}
                          className="text-3xl transition duration-200"
                        >
                          <FontAwesomeIcon
                            icon={settings.allowReadReceipts ? faToggleOn : faToggleOff}
                            className={settings.allowReadReceipts ? 'text-green-600' : 'text-gray-400'}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Activity Status</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Show your activity status</p>
                        </div>
                        <button
                          onClick={() => handleToggle('activityStatus')}
                          className="text-3xl transition duration-200"
                        >
                          <FontAwesomeIcon
                            icon={settings.activityStatus ? faToggleOn : faToggleOff}
                            className={settings.activityStatus ? 'text-green-600' : 'text-gray-400'}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                      <button
                        onClick={() => handleToggle('emailNotifications')}
                        className="text-3xl transition duration-200"
                      >
                        <FontAwesomeIcon
                          icon={settings.emailNotifications ? faToggleOn : faToggleOff}
                          className={settings.emailNotifications ? 'text-green-600' : 'text-gray-400'}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications on your device</p>
                      </div>
                      <button
                        onClick={() => handleToggle('pushNotifications')}
                        className="text-3xl transition duration-200"
                      >
                        <FontAwesomeIcon
                          icon={settings.pushNotifications ? faToggleOn : faToggleOff}
                          className={settings.pushNotifications ? 'text-green-600' : 'text-gray-400'}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Message Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when you receive new messages</p>
                      </div>
                      <button
                        onClick={() => handleToggle('messageNotifications')}
                        className="text-3xl transition duration-200"
                      >
                        <FontAwesomeIcon
                          icon={settings.messageNotifications ? faToggleOn : faToggleOff}
                          className={settings.messageNotifications ? 'text-green-600' : 'text-gray-400'}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Appearance Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-4">Theme</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setDarkMode(false)}
                          className={`p-4 rounded-lg border-2 transition duration-200 flex flex-col items-center gap-2 ${
                            !darkMode
                              ? 'border-blue-600 bg-blue-50 dark:bg-gray-700'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <FontAwesomeIcon icon={faSun} className="w-8 h-8 text-yellow-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">Light</span>
                        </button>
                        <button
                          onClick={() => setDarkMode(true)}
                          className={`p-4 rounded-lg border-2 transition duration-200 flex flex-col items-center gap-2 ${
                            darkMode
                              ? 'border-blue-600 bg-blue-50 dark:bg-gray-700'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <FontAwesomeIcon icon={faMoon} className="w-8 h-8 text-indigo-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">Dark</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={settings.language}
                        onChange={handleSelectChange}
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
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleSelectChange}
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
              )}

              {/* Data & Privacy Settings */}
              {activeTab === 'data' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Data & Privacy</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        We take your privacy seriously. Your data is encrypted and stored securely. You can download or delete your data at any time.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Data Export</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Download a copy of your data in JSON format. This includes your profile information, messages, and settings.
                      </p>
                      <button
                        onClick={handleExportData}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                        Export My Data
                      </button>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Deleting your account is permanent and cannot be undone. All your data will be removed from our servers.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
