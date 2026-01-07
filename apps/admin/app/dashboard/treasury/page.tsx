import { Metadata } from 'next';
import { Wallet, TrendingUp, Download, Upload, DollarSign } from 'lucide-react';
import { formatNumber, formatDate } from '../../../lib/utils';

export const metadata: Metadata = {
  title: 'Treasury | CastQuest',
  description: 'Manage treasury balances and transactions',
};

export default function TreasuryPage() {
  // Placeholder data
  const balances = [
    {
      token: 'USDC',
      balance: 45234.56,
      value: 45234.56,
      change24h: 2.3,
      allocated: 12500.0,
    },
    {
      token: 'ETH',
      balance: 12.45,
      value: 28914.75,
      change24h: -1.2,
      allocated: 5.2,
    },
    {
      token: 'DAI',
      balance: 18900.0,
      value: 18900.0,
      change24h: 0.1,
      allocated: 8400.0,
    },
    {
      token: 'CAST',
      balance: 150000.0,
      value: 367500.0,
      change24h: 5.7,
      allocated: 45000.0,
    },
  ];

  const totalValue = balances.reduce((sum, b) => sum + b.value, 0);
  const totalAllocated = balances.reduce(
    (sum, b) =>
      sum + (b.token === 'CAST' ? b.allocated * 2.45 : b.allocated * 1),
    0
  );

  const transactions = [
    {
      id: '1',
      type: 'deposit',
      token: 'USDC',
      amount: 5000.0,
      from: '0x1234...5678',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed',
    },
    {
      id: '2',
      type: 'withdrawal',
      token: 'ETH',
      amount: 2.5,
      to: '0x8765...4321',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'completed',
    },
    {
      id: '3',
      type: 'reward',
      token: 'CAST',
      amount: 1000.0,
      to: '0x9999...1111',
      timestamp: '2024-01-15T08:45:00Z',
      status: 'completed',
    },
    {
      id: '4',
      type: 'deposit',
      token: 'DAI',
      amount: 3000.0,
      from: '0x2222...3333',
      timestamp: '2024-01-14T22:10:00Z',
      status: 'completed',
    },
    {
      id: '5',
      type: 'withdrawal',
      token: 'USDC',
      amount: 1500.0,
      to: '0x4444...5555',
      timestamp: '2024-01-14T18:30:00Z',
      status: 'pending',
    },
  ];

  const getTransactionColor = (type: string) => {
    const colors: Record<string, string> = {
      deposit: 'text-success',
      withdrawal: 'text-error',
      reward: 'text-primary',
    };
    return colors[type] || 'text-neutral-400';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' ? <Download size={16} /> : <Upload size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Treasury</h1>
          <p className="mt-2 text-neutral-400">
            Manage balances and track transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-success text-black rounded-lg hover:bg-success/90 transition-colors font-medium">
            <Download size={18} />
            Deposit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors">
            <Upload size={18} />
            Withdraw
          </button>
        </div>
      </div>

      {/* Total Value */}
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="text-primary" size={24} />
          <h2 className="text-lg font-medium text-neutral-300">
            Total Treasury Value
          </h2>
        </div>
        <div className="text-4xl font-bold text-white mb-2">
          ${formatNumber(totalValue)}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-success">
            <TrendingUp size={16} />
            <span>+3.2% (24h)</span>
          </div>
          <span className="text-neutral-400">
            Allocated: ${formatNumber(totalAllocated)}
          </span>
        </div>
      </div>

      {/* Token Balances */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Token Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {balances.map((balance) => (
            <div
              key={balance.token}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                    <DollarSign className="text-primary" size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {balance.token}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {formatNumber(balance.balance)} tokens
                    </div>
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    balance.change24h >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {balance.change24h >= 0 ? '+' : ''}
                  {balance.change24h}%
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Value:</span>
                <span className="text-white font-medium">
                  ${formatNumber(balance.value)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-neutral-400">Allocated:</span>
                <span className="text-warning">
                  {balance.token === 'CAST'
                    ? formatNumber(balance.allocated)
                    : `$${formatNumber(balance.allocated)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Transaction History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 ${getTransactionColor(
                        tx.type
                      )}`}
                    >
                      {getTransactionIcon(tx.type)}
                      <span className="capitalize font-medium">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{tx.token}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{formatNumber(tx.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-400 font-mono text-sm">
                      {'from' in tx ? tx.from : 'to' in tx ? tx.to : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-400 text-sm">
                      {formatDate(tx.timestamp)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${
                        tx.status === 'completed'
                          ? 'text-success bg-success/10 border-success/30'
                          : 'text-warning bg-warning/10 border-warning/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
'use client';

import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

