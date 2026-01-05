"use client";

import { neo } from "@castquest/neo-ux-core";

export default function ContractsPage() {
  const contracts = [
    {
      id: "1",
      name: "FrameFactory",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7",
      chain: "Base",
      functions: ["createFrame", "updateFrame", "validateFrame"],
    },
    {
      id: "2",
      name: "QuestManager",
      address: "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf",
      chain: "Base",
      functions: ["createQuest", "completeQuest", "claimReward"],
    },
    {
      id: "3",
      name: "TreasuryVault",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      chain: "Ethereum",
      functions: ["deposit", "withdraw", "getBalance"],
    },
    {
      id: "4",
      name: "NFTMinter",
      address: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
      chain: "Zora",
      functions: ["mint", "burn", "transfer"],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Smart Contracts 📝
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Verified contracts deployed across supported chains.
        </p>
      </div>

      <div className={`rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${neo.colors.bg.tertiary}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                  Contract Name
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                  Address
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                  Chain
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                  Functions
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${neo.colors.text.tertiary} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-neutral-900 transition-colors">
                  <td className={`px-6 py-4 ${neo.colors.text.primary} font-semibold`}>
                    {contract.name}
                  </td>
                  <td className={`px-6 py-4 font-mono text-sm ${neo.colors.text.secondary}`}>
                    {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400`}>
                      {contract.chain}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contract.functions.map((func) => (
                        <span
                          key={func}
                          className={`px-2 py-0.5 rounded text-xs font-mono ${neo.colors.bg.tertiary} ${neo.colors.text.tertiary}`}
                        >
                          {func}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className={`px-3 py-1 rounded text-sm font-semibold ${neo.colors.text.accent} hover:bg-emerald-500/10 transition-all`}>
                      View ABI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
