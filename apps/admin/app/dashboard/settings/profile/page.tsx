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
  Download,
  ArrowUpCircle,
  Twitter,
  Github,
  Globe,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { neo } from '@castquest/neo-ux-core';

export default function ProfilePage() {
  const { user, login, logout, authenticated, linkWallet, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  const [copying, setCopying] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  // Mock wallet balances
  const walletBalances = [
    { token: 'USDC', amount: '1,250.50', usdValue: '$1,250.50', icon: '💵' },
    { token: 'ETH', amount: '0.85', usdValue: '$2,125.00', icon: '💎' },
    { token: 'CAST', amount: '5,420', usdValue: '$542.00', icon: '🎯' },
  ];

  // Mock transaction history
  const transactions = [
    { id: '1', type: 'Received', token: 'USDC', amount: '+500', time: '2 hours ago', status: 'completed', hash: '0xabc...def' },
    { id: '2', type: 'Sent', token: 'ETH', amount: '-0.05', time: '5 hours ago', status: 'completed', hash: '0x123...456' },
    { id: '3', type: 'Mint', token: 'NFT', amount: '1', time: '1 day ago', status: 'completed', hash: '0x789...abc' },
    { id: '4', type: 'Received', token: 'CAST', amount: '+100', time: '2 days ago', status: 'completed', hash: '0xdef...789' },
  ];

  // Mock social connections
  const socialConnections = [
    { platform: 'Farcaster', username: '@castmaster', connected: true, icon: '🎭', color: 'purple' },
    { platform: 'Google', username: user?.email?.address || 'Not connected', connected: !!user?.email, icon: '🌐', color: 'blue' },
    { platform: 'Twitter', username: 'Not connected', connected: false, icon: '🐦', color: 'cyan' },
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(id);
      setTimeout(() => setCopying(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExportPrivateKey = async () => {
    try {
      // In production, this would use Privy's exportWallet method
      if (exportWallet) {
        await exportWallet();
      }
      setShowExportModal(false);
    } catch (err) {
      console.error('Failed to export wallet:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent ${neo.animation.pulse}`}>
                Smart Wallet Profile
              </h1>
              <p className={neo.colors.text.secondary}>Manage your account, wallet, and social connections</p>
            </div>
            <button
              onClick={logout}
              className={`px-4 py-2 border ${neo.colors.border.default} rounded-lg ${neo.colors.text.secondary} hover:${neo.colors.text.primary} hover:border-neutral-700 transition-all`}
            >
              Logout
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Wallet */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`border ${neo.colors.border.glow} rounded-xl p-6 bg-black/40 backdrop-blur-sm ${neo.glow.idle}`}
            >
              <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4 flex items-center gap-2`}>
                <User className="w-6 h-6 text-purple-400" />
                Profile Information
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
                  {user?.email?.address?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-2xl font-bold ${neo.colors.text.primary}`}>
                      {user?.id ? `User ${user.id.slice(0, 8)}...` : 'Anonymous User'}
                    </span>
                    {user?.email && (
                      <CheckCircle className={`w-5 h-5 ${neo.colors.text.success}`} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className={`w-4 h-4 ${neo.colors.text.tertiary}`} />
                    <p className={neo.colors.text.secondary}>
                      {user?.email?.address || 'No email connected'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Smart Wallet Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`border ${neo.colors.border.glow} rounded-xl p-6 bg-black/40 backdrop-blur-sm ${neo.glow.idle}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${neo.colors.text.primary} flex items-center gap-2`}>
                  <Wallet className="w-6 h-6 text-purple-400" />
                  Connected Wallets
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFundModal(true)}
                    className={`px-3 py-2 rounded-lg border ${neo.colors.border.glow} ${neo.glow.success} bg-emerald-500/10 ${neo.colors.text.success} hover:bg-emerald-500/20 transition-all flex items-center gap-2 text-sm`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Fund Wallet
                  </button>
                </div>
              </div>
              {wallets && wallets.length > 0 ? (
                <div className="space-y-4">
                  {wallets.map((wallet, index) => (
                    <div
                      key={index}
                      className={`p-4 border ${neo.colors.border.default} rounded-lg bg-neutral-900/50`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Wallet className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <div className={`${neo.colors.text.primary} font-semibold`}>
                              {wallet.walletClientType === 'privy' ? '🔐 Embedded Smart Wallet' : '💼 External Wallet'}
                            </div>
                            <div className={`${neo.colors.text.tertiary} text-sm font-mono`}>{wallet.address}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(wallet.address, `wallet-${index}`)}
                            className={`p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg ${neo.colors.text.tertiary} hover:${neo.colors.text.primary} transition-all`}
                          >
                            {copying === `wallet-${index}` ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          {wallet.walletClientType === 'privy' && (
                            <button
                              onClick={() => setShowExportModal(true)}
                              className={`p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg ${neo.colors.text.tertiary} hover:${neo.colors.text.primary} transition-all`}
                              title="Export Private Key"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={linkWallet}
                    className={`w-full px-4 py-3 border ${neo.colors.border.default} hover:${neo.colors.border.glow} rounded-lg ${neo.colors.text.tertiary} hover:${neo.colors.text.primary} transition-all flex items-center justify-center gap-2`}
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Additional Wallet
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className={`w-12 h-12 ${neo.colors.text.tertiary} mx-auto mb-4`} />
                  <p className={`${neo.colors.text.secondary} mb-4`}>No wallets connected</p>
                  <button
                    onClick={linkWallet}
                    className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all ${neo.glow.purple}`}
                  >
                    Connect Wallet
                  </button>
                </div>
              )}
            </motion.div>

            {/* Wallet Balances */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`border ${neo.colors.border.glow} rounded-xl p-6 bg-black/40 backdrop-blur-sm ${neo.glow.idle}`}
            >
              <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4 flex items-center gap-2`}>
                <DollarSign className="w-6 h-6 text-emerald-400" />
                Wallet Balances
              </h2>
              <div className="space-y-3">
                {walletBalances.map((balance) => (
                  <div
                    key={balance.token}
                    className={`p-4 border ${neo.colors.border.default} rounded-lg bg-neutral-900/50 flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{balance.icon}</span>
                      <div>
                        <div className={`${neo.colors.text.primary} font-bold text-lg`}>{balance.amount}</div>
                        <div className={`${neo.colors.text.tertiary} text-sm`}>{balance.token}</div>
                      </div>
                    </div>
                    <div className={`${neo.colors.text.accent} font-semibold`}>{balance.usdValue}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`border ${neo.colors.border.glow} rounded-xl p-6 bg-black/40 backdrop-blur-sm ${neo.glow.idle}`}
            >
              <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4 flex items-center gap-2`}>
                <Clock className="w-6 h-6 text-cyan-400" />
                Recent Transactions
              </h2>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className={`p-4 border ${neo.colors.border.default} rounded-lg bg-neutral-900/50 flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.type === 'Received' ? 'bg-emerald-500/20' : 'bg-purple-500/20'}`}>
                        {tx.type === 'Received' ? (
                          <TrendingUp className={`w-4 h-4 ${neo.colors.text.success}`} />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <div className={`${neo.colors.text.primary} font-semibold`}>
                          {tx.type} {tx.token}
                        </div>
                        <div className={`${neo.colors.text.tertiary} text-sm`}>{tx.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`font-bold ${tx.amount.startsWith('+') ? neo.colors.text.success : neo.colors.text.purple}`}>
                        {tx.amount}
                      </div>
                      <button
                        onClick={() => copyToClipboard(tx.hash, `tx-${tx.id}`)}
                        className={`p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg ${neo.colors.text.tertiary} hover:${neo.colors.text.primary} transition-all`}
                      >
                        {copying === `tx-${tx.id}` ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Social Connections */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`border ${neo.colors.border.glow} rounded-xl p-6 bg-black/40 backdrop-blur-sm ${neo.glow.idle}`}
            >
              <h2 className={`text-xl font-bold ${neo.colors.text.primary} mb-4 flex items-center gap-2`}>
                <Globe className="w-5 h-5 text-cyan-400" />
                Social Connections
              </h2>
              <div className="space-y-3">
                {socialConnections.map((social) => (
                  <div
                    key={social.platform}
                    className={`p-4 border ${neo.colors.border.default} rounded-lg bg-neutral-900/50`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{social.icon}</span>
                        <span className={`${neo.colors.text.primary} font-semibold`}>{social.platform}</span>
                      </div>
                      {social.connected && (
                        <CheckCircle className={`w-4 h-4 ${neo.colors.text.success}`} />
                      )}
                    </div>
                    <div className={`${neo.colors.text.tertiary} text-sm mb-3`}>{social.username}</div>
                    {!social.connected && (
                      <button className={`w-full px-3 py-2 rounded-lg border ${neo.colors.border.default} hover:${neo.colors.border.glow} ${neo.colors.text.tertiary} hover:${neo.colors.text.primary} transition-all text-sm`}>
                        Connect {social.platform}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Export Private Key Modal */}
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`max-w-md w-full border ${neo.colors.border.glow} rounded-xl p-6 bg-neutral-900 ${neo.glow.error}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <h3 className={`text-2xl font-bold ${neo.colors.text.primary}`}>Export Private Key</h3>
              </div>
              <p className={`${neo.colors.text.secondary} mb-4`}>
                ⚠️ Warning: Never share your private key with anyone. Anyone with access to your private key can access your wallet and steal your funds.
              </p>
              <p className={`${neo.colors.text.tertiary} text-sm mb-6`}>
                This action will export your wallet&apos;s private key. Make sure you&apos;re in a secure environment and no one can see your screen.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className={`flex-1 px-4 py-3 rounded-lg border ${neo.colors.border.default} ${neo.colors.text.secondary} hover:${neo.colors.text.primary} transition-all`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportPrivateKey}
                  className={`flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all`}
                >
                  Export Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Fund Wallet Modal */}
        {showFundModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowFundModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`max-w-md w-full border ${neo.colors.border.glow} rounded-xl p-6 bg-neutral-900 ${neo.glow.success}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <ArrowUpCircle className="w-8 h-8 text-emerald-400" />
                <h3 className={`text-2xl font-bold ${neo.colors.text.primary}`}>Fund Your Wallet</h3>
              </div>
              <p className={`${neo.colors.text.secondary} mb-6`}>
                Choose a method to add funds to your smart wallet
              </p>
              <div className="space-y-3 mb-6">
                <button className={`w-full p-4 border ${neo.colors.border.glow} rounded-lg ${neo.glow.idle} hover:${neo.glow.active} bg-neutral-800/50 ${neo.colors.text.primary} text-left transition-all`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <div className="font-semibold">Buy with Card</div>
                      <div className={`${neo.colors.text.tertiary} text-sm`}>Purchase crypto with credit/debit card</div>
                    </div>
                  </div>
                </button>
                <button className={`w-full p-4 border ${neo.colors.border.glow} rounded-lg ${neo.glow.idle} hover:${neo.glow.active} bg-neutral-800/50 ${neo.colors.text.primary} text-left transition-all`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <div className="font-semibold">Transfer from Wallet</div>
                      <div className={`${neo.colors.text.tertiary} text-sm`}>Send funds from another wallet</div>
                    </div>
                  </div>
                </button>
                <button className={`w-full p-4 border ${neo.colors.border.glow} rounded-lg ${neo.glow.idle} hover:${neo.glow.active} bg-neutral-800/50 ${neo.colors.text.primary} text-left transition-all`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌉</span>
                    <div>
                      <div className="font-semibold">Bridge Assets</div>
                      <div className={`${neo.colors.text.tertiary} text-sm`}>Bridge from other chains</div>
                    </div>
                  </div>
                </button>
              </div>
              <button
                onClick={() => setShowFundModal(false)}
                className={`w-full px-4 py-3 rounded-lg border ${neo.colors.border.default} ${neo.colors.text.secondary} hover:${neo.colors.text.primary} transition-all`}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
