'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function ProfilePage() {
  const { user, login, logout, authenticated, linkWallet } = usePrivy();
  const { wallets } = useWallets();
  const [copying, setCopying] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(id);
      setTimeout(() => setCopying(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all"
          >
            Login with Privy
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
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
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
              {user?.email?.address?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-white">
                  {user?.id ? `User ${user.id.slice(0, 8)}...` : 'Anonymous User'}
                </span>
                {user?.email && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
              <p className="text-slate-400 text-sm">
                {user?.email?.address || 'No email connected'}
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
                  className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
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
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
