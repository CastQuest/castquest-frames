'use client';

import { useState } from 'react';
import { Camera, Save } from 'lucide-react';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('Admin User');
  const [email, setEmail] = useState('admin@castquest.xyz');
  const [bio, setBio] = useState('CastQuest Administrator');
  const [twitter, setTwitter] = useState('@castquest');
  const [website, setWebsite] = useState('https://castquest.xyz');

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="mt-2 text-neutral-400">
          Manage your personal information and public profile
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Personal Information
        </h2>

        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-2xl font-bold text-primary">
                A
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors">
                <Camera size={16} />
                Upload Photo
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            />
            <p className="mt-2 text-sm text-neutral-500">
              Your email is verified
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <p className="mt-2 text-sm text-neutral-500">
              Brief description for your profile. Max 160 characters.
            </p>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Twitter Handle
              </label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Connected Wallet
        </h2>
        <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg">
          <div>
            <div className="text-white font-medium font-mono">
              0x1234...5678
            </div>
            <div className="text-sm text-neutral-400 mt-1">
              Primary wallet address
            </div>
          </div>
          <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg hover:border-neutral-600 transition-colors text-sm">
            Disconnect
          </button>
        </div>
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import {
  Wallet,
  Mail,
  Shield,
  CheckCircle,
  Copy,
  ExternalLink,
  User,
  Edit,
  Link as LinkIcon,
  Twitter,
  Github,
} from 'lucide-react';

