'use client';

import { useState } from 'react';
import { Shield, Key, Smartphone, Link as LinkIcon, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const connectedAccounts = [
    { id: '1', platform: 'Farcaster', username: '@castquest', connected: true },
    { id: '2', platform: 'Twitter', username: '@castquest', connected: true },
    { id: '3', platform: 'Discord', username: 'castquest#1234', connected: false },
  ];

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Security Settings</h1>
        <p className="mt-2 text-neutral-400">
          Manage your password, 2FA, and connected accounts
        </p>
      </div>

      {/* Password Change */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-white">Change Password</h2>
        </div>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            />
            <p className="mt-2 text-sm text-neutral-500">
              Must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="text-success" size={24} />
          <h2 className="text-xl font-bold text-white">
            Two-Factor Authentication
          </h2>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-neutral-400 mb-4">
              Add an extra layer of security to your account by requiring a
              verification code in addition to your password.
            </p>
            {twoFactorEnabled && (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle size={20} />
                <span className="font-medium">2FA is currently enabled</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              twoFactorEnabled
                ? 'bg-error text-white hover:bg-error/90'
                : 'bg-success text-black hover:bg-success/90'
            }`}
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <LinkIcon className="text-secondary" size={24} />
          <h2 className="text-xl font-bold text-white">Connected Accounts</h2>
        </div>

        <div className="space-y-4">
          {connectedAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg"
            >
              <div>
                <div className="text-white font-medium">{account.platform}</div>
                <div className="text-sm text-neutral-400 mt-1">
                  {account.connected ? account.username : 'Not connected'}
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  account.connected
                    ? 'bg-neutral-800 border border-neutral-700 text-white hover:border-neutral-600'
                    : 'bg-primary text-black hover:bg-primary/90'
                }`}
              >
                {account.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-neutral-950 border border-warning/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-warning" size={24} />
          <h2 className="text-xl font-bold text-white">Security Tips</h2>
        </div>
        <ul className="space-y-2 text-neutral-400">
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Use a strong, unique password for your CastQuest account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Enable two-factor authentication for added security</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Never share your password or 2FA codes with anyone</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Regularly review your connected accounts and sessions</span>
          </li>
        </ul>
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

