'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useClientAuth, handleLogout } from '@/lib/client-auth';
import ProfileCard from '@/app/components/profile/ProfileCard';
import ProfileEditForm from '@/app/components/profile/ProfileEditForm';
import ProfileInfoView from '@/app/components/profile/ProfileInfoView';
import SecuritySettings from '@/app/components/profile/SecuritySettings';
import LoadingSpinner from '@/app/components/shared/LoadingSpinner';

interface UserData {
  name: string;
  email: string;
  accessToken: string;
  image: string | null;
}

export default function Profile() {
  const { user, isLoading, isAuthenticated } = useClientAuth({ requireAuth: true });
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData?.name || 'John Doe',
    email: userData?.email || 'john.doe@example.com',
    avatar: userData?.image || '',
  });

  const [formData, setFormData] = useState(profileData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    setUserData(user as unknown as UserData);
    const newProfileData = {
      name: user.name || 'John Doe',
      email: user.email || 'john.doe@example.com',
      avatar: user.image || '',
    };
    setProfileData(newProfileData);
    setFormData(newProfileData);
  }, [user]);

  // Sync formData with profileData whenever profileData changes
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = async () => {
    const { name, email } = formData;

    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch('/api/user/change-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newName: name, email, accessToken }),
    });
    const result = await response.json();
    if (!response.ok) {
      return;
    }

    formData.name = result.newName;
    formData.avatar = profileData.avatar;
    console.log("Updated formData:", formData);
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard
              profileData={profileData}
              isEditing={isEditing}
              onEditToggle={() => {
                setFormData(profileData);
                setIsEditing(true);
              }}
            />
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
              {isEditing ? (
                <ProfileEditForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <ProfileInfoView profileData={profileData} />
              )}

              {/* Security Section */}
              {!isEditing && (
                <SecuritySettings
                  passwordData={passwordData}
                  onPasswordChange={handlePasswordChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
