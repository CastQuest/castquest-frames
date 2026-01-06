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

export default function ProfilePage() {
  const { user, login, logout, authenticated, linkEmail, linkWallet, linkFarcaster, linkGoogle } = usePrivy();
  const { wallets } = useWallets();
  const [copying, setCopying] = useState<string | null>(null);

  // Block explorer URL - configurable for multi-chain support
  const getExplorerUrl = (address: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || 'https://basescan.org';
    return `${baseUrl}/address/${address}`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(id);
      setTimeout(() => setCopying(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Shield className="w-20 h-20 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-slate-400 mb-8">Please login to view your profile</p>
          <button
            onClick={login}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
          >
            Login with Privy
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Profile Settings
              </h1>
              <p className="text-slate-400">Manage your account and smart wallet</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            Profile Information
          </h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
                {user?.email?.address?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full hover:bg-purple-500 transition-all">
                <Edit className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-white">
                  {user?.id ? `User ${user.id.slice(0, 8)}...` : 'Anonymous User'}
                </span>
                {user?.email?.verified && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
              <p className="text-slate-400 text-sm">
                {user?.email?.address ? `Email: ${user.email.address}` : 'CastQuest User ID: ' + (user?.id || 'N/A')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Smart Wallet Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-purple-400" />
            Smart Wallet
          </h2>
          {wallets && wallets.length > 0 ? (
            <div className="space-y-4">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Wallet className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : 'External Wallet'}
                        </div>
                        <div className="text-slate-400 text-sm font-mono">{wallet.address}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(wallet.address, `wallet-${index}`)}
                        className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 transition-all"
                      >
                        {copying === `wallet-${index}` ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={getExplorerUrl(wallet.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  {/* TODO: Implement real-time balance fetching from blockchain
                   * Current values are placeholders (0.00) and should be replaced with actual on-chain balances
                   * Consider using wagmi hooks or viem to fetch balances for ETH, USDC, and CAST tokens
                   */}
                  {/* 
                   * TODO: Replace the placeholder balances below with real on-chain values.
                   * These "0.00" amounts are mock data and should not be treated as actual balances.
                   */}
                  <div className="pt-3 border-t border-slate-700">
                    <div className="mb-3">
                      <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-dashed border-slate-600">
                        Balance display coming soon
                      </span>
                      <p className="mt-1 text-xs text-slate-500">
                        The values below are placeholders while on-chain balance retrieval is being implemented.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-slate-500 text-xs mb-1">ETH Balance</div>
                        <div className="text-white font-semibold">0.00 ETH</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">USDC Balance</div>
                        <div className="text-white font-semibold">0.00 USDC</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">CAST Balance</div>
                        <div className="text-purple-400 font-semibold">0 CAST</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={linkWallet}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-lg text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Connect Additional Wallet
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No wallets connected</p>
              <button
                onClick={linkWallet}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </motion.div>

        {/* Authentication Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-cyan-400" />
            Authentication
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-white font-semibold">Email</div>
                  <div className="text-slate-400 text-sm">{user?.email?.address || 'Not connected'}</div>
                </div>
              </div>
              {user?.email?.verified ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <button
                  onClick={linkEmail}
                  className="px-3 py-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-full text-xs font-semibold transition-all"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Connected Accounts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-400" />
            Connected Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const accountColorClasses: Record<string, { bg: string; text: string }> = {
                purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
                red: { bg: 'bg-red-500/20', text: 'text-red-400' },
                blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
                gray: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
              };

              return [
                { name: 'Farcaster', icon: LinkIcon, color: 'purple', action: linkFarcaster, connected: !!user?.farcaster },
                { name: 'Google', icon: Mail, color: 'red', action: linkGoogle, connected: !!user?.google },
                // TODO: Implement Twitter and GitHub OAuth integration
                { name: 'Twitter', icon: Twitter, color: 'blue', action: () => { alert('Twitter integration coming soon'); }, connected: false },
                { name: 'GitHub', icon: Github, color: 'gray', action: () => { alert('GitHub integration coming soon'); }, connected: false },
              ].map((account) => {
                const colorClass = accountColorClasses[account.color];
                return (
                  <div
                    key={account.name}
                    className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${colorClass.bg} rounded-lg`}>
                          <account.icon className={`w-5 h-5 ${colorClass.text}`} />
                        </div>
                        <span className="text-white font-semibold">{account.name}</span>
                      </div>
                      {account.connected ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                          Connected
                        </span>
                      ) : (
                        <button
                          onClick={account.action}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full text-xs font-semibold transition-all"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
