'use client';

import { useState } from 'react';
import { DashboardStat, GlowButton, GlowCard } from '@castquest/neo-ux-core';

/**
 * Fee Management Dashboard
 * 
 * Provides transparent view and management of CastQuest V3 fee structure
 */
export default function FeeManagementPage() {
  const [feeConfig] = useState({
    protocolFeeBps: 250,
    developerFeeBps: 50,
    treasuryFeeBps: 200,
    protocolTreasury: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    developerTreasury: 'monads.skr',
    daoTreasury: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    feesActive: true,
  });

  const [fees24h] = useState({
    protocol: 2.5,
    developer: 0.5,
    dao: 2.0,
    total: 5.0,
  });

  const formatBps = (bps: number) => `${(bps / 100).toFixed(2)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Fee Management</h1>
          <p className="text-gray-400">
            Transparent, governance-controlled fee structure for CastQuest V3
          </p>
        </div>
        <GlowButton variant="gradient" size="lg">
          Propose Fee Change
        </GlowButton>
      </div>

      {/* Fee Status */}
      <GlowCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Fee Status</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              feeConfig.feesActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {feeConfig.feesActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardStat
            label="Total Trading Fee"
            value={formatBps(
              feeConfig.protocolFeeBps + feeConfig.developerFeeBps + feeConfig.treasuryFeeBps
            )}
            trend="stable"
            icon="💰"
          />
          <DashboardStat
            label="24h Volume"
            value="12.5 ETH"
            trend="up"
            trendValue="+15%"
            icon="📈"
          />
          <DashboardStat
            label="Total Fees Collected"
            value={`${fees24h.total} ETH`}
            trend="up"
            trendValue="+8%"
            icon="💸"
          />
        </div>
      </GlowCard>

      {/* Current Fee Structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Protocol Fee */}
        <GlowCard className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Protocol Fee</h3>
              <p className="text-2xl font-bold text-purple-400">
                {formatBps(feeConfig.protocolFeeBps)}
              </p>
            </div>
            <span className="text-3xl">🏛️</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">Destination</p>
              <p className="text-xs font-mono text-white break-all">
                {feeConfig.protocolTreasury}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Purpose</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Protocol development</li>
                <li>• Security audits</li>
                <li>• Developer grants</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">24h Collection</p>
              <p className="text-sm font-semibold text-white">{fees24h.protocol} ETH</p>
            </div>
          </div>
        </GlowCard>

        {/* Developer Fee */}
        <GlowCard className="p-6 border-blue-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Developer Fee</h3>
              <p className="text-2xl font-bold text-blue-400">
                {formatBps(feeConfig.developerFeeBps)}
              </p>
            </div>
            <span className="text-3xl">👨‍💻</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">Destination</p>
              <p className="text-sm font-mono text-white">{feeConfig.developerTreasury}</p>
              <p className="text-xs text-gray-500 mt-1">ENS: monads.skr (EVM)</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Purpose</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Core team compensation</li>
                <li>• Ongoing maintenance</li>
                <li>• Technical support</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">24h Collection</p>
              <p className="text-sm font-semibold text-white">{fees24h.developer} ETH</p>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                ✅ Transparent & on-chain
                <br />✅ Governance adjustable
              </p>
            </div>
          </div>
        </GlowCard>

        {/* Treasury Fee */}
        <GlowCard className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">DAO Treasury</h3>
              <p className="text-2xl font-bold text-green-400">
                {formatBps(feeConfig.treasuryFeeBps)}
              </p>
            </div>
            <span className="text-3xl">🏦</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">Destination</p>
              <p className="text-xs font-mono text-white break-all">{feeConfig.daoTreasury}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Purpose</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Liquidity incentives</li>
                <li>• Token buybacks</li>
                <li>• Community initiatives</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">24h Collection</p>
              <p className="text-sm font-semibold text-white">{fees24h.dao} ETH</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Fee Distribution Chart */}
      <GlowCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Fee Distribution</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Protocol (50%)</span>
              <span className="text-white">2.5%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Treasury (40%)</span>
              <span className="text-white">2.0%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Developer (10%)</span>
              <span className="text-white">0.5%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Governance Controls */}
      <GlowCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Governance Controls</h2>
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">Fee Change Process</h3>
            <ol className="text-sm text-gray-300 space-y-2">
              <li>1. Create governance proposal (requires 100,000 CAST)</li>
              <li>2. Community voting period (~7 days)</li>
              <li>3. 48-hour timelock if approved</li>
              <li>4. Automatic execution after timelock</li>
            </ol>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-400 mb-2">⚠️ Fee Caps</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Maximum total fee: 10% (1000 bps)</li>
              <li>• Minimum timelock: 48 hours</li>
              <li>• All changes require governance approval</li>
            </ul>
          </div>
        </div>
      </GlowCard>

      {/* Documentation Link */}
      <GlowCard className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">📚 Fee Structure Documentation</h3>
            <p className="text-sm text-gray-300">
              Learn more about our transparent fee structure, governance process, and how fees support the protocol.
            </p>
          </div>
          <GlowButton variant="outline">View Docs</GlowButton>
        </div>
      </GlowCard>
    </div>
  );
}
