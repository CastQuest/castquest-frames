"use client"

import { useState, useEffect } from "react"
import { 
  Code2,
  Rocket,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  FileCode,
  Cpu,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react"

interface ContractDeployment {
  id: string
  name: string | null
  chainId: number
  address: string | null
  txHash: string | null
  compilerVersion: string | null
  status: "pending" | "deploying" | "deployed" | "failed"
  errorMessage: string | null
  createdAt: string
}

const chains = [
  { id: 1, name: "Ethereum Mainnet", icon: "Ξ", color: "#627EEA", explorer: "https://etherscan.io" },
  { id: 8453, name: "Base", icon: "B", color: "#0052FF", explorer: "https://basescan.org" },
  { id: 10, name: "Optimism", icon: "OP", color: "#FF0420", explorer: "https://optimistic.etherscan.io" },
  { id: 42161, name: "Arbitrum", icon: "A", color: "#28A0F0", explorer: "https://arbiscan.io" },
  { id: 137, name: "Polygon", icon: "P", color: "#8247E5", explorer: "https://polygonscan.com" },
  { id: 84532, name: "Base Sepolia", icon: "BS", color: "#0052FF", explorer: "https://sepolia.basescan.org" },
  { id: 11155111, name: "Sepolia", icon: "S", color: "#CFB5F0", explorer: "https://sepolia.etherscan.io" },
]

const sampleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CastQuestToken {
    string public name = "CastQuest";
    string public symbol = "CQST";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10 ** decimals;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}`

// Demo deployments
const demoDeployments: ContractDeployment[] = [
  { 
    id: "d1", 
    name: "CastQuestToken", 
    chainId: 8453, 
    address: "0x1234567890abcdef1234567890abcdef12345678", 
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", 
    compilerVersion: "0.8.20",
    status: "deployed",
    errorMessage: null,
    createdAt: "2024-01-15T10:30:00Z"
  },
  { 
    id: "d2", 
    name: "FrameRegistry", 
    chainId: 84532, 
    address: "0xabcdef1234567890abcdef1234567890abcdef12", 
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", 
    compilerVersion: "0.8.20",
    status: "deployed",
    errorMessage: null,
    createdAt: "2024-02-20T14:45:00Z"
  },
]

export default function ContractsPage() {
  const [deployments, setDeployments] = useState<ContractDeployment[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [sourceCode, setSourceCode] = useState(sampleContract)
  const [contractName, setContractName] = useState("CastQuestToken")
  const [selectedChain, setSelectedChain] = useState(84532) // Base Sepolia default
  const [constructorArgs, setConstructorArgs] = useState("1000000")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setDeployments(demoDeployments)
      setLoading(false)
    }, 500)
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedAddress(id)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const deployContract = async () => {
    if (!sourceCode.trim()) {
      showNotification("error", "Please enter contract source code")
      return
    }

    setDeploying(true)
    
    // Create pending deployment
    const pendingDeployment: ContractDeployment = {
      id: `d${Date.now()}`,
      name: contractName,
      chainId: selectedChain,
      address: null,
      txHash: null,
      compilerVersion: "0.8.20",
      status: "deploying",
      errorMessage: null,
      createdAt: new Date().toISOString(),
    }
    
    setDeployments(prev => [pendingDeployment, ...prev])

    try {
      const res = await fetch("/api/contracts/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contractName,
          chainId: selectedChain,
          sourceCode,
          constructorArgs: constructorArgs ? constructorArgs.split(",").map(a => a.trim()) : [],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setDeployments(prev => prev.map(d => 
          d.id === pendingDeployment.id 
            ? { ...d, ...data.deployment, status: "deployed" }
            : d
        ))
        showNotification("success", `Contract deployed to ${data.deployment.address}`)
      } else {
        const error = await res.json()
        setDeployments(prev => prev.map(d => 
          d.id === pendingDeployment.id 
            ? { ...d, status: "failed", errorMessage: error.error }
            : d
        ))
        showNotification("error", error.error || "Deployment failed")
      }
    } catch (error) {
      // Demo mode: simulate deployment when API is not available
      // In production, this would show a real error
      if (process.env.NODE_ENV === "development") {
        const fakeAddress = `0x${Math.random().toString(16).substring(2, 42)}`
        const fakeTxHash = `0x${Math.random().toString(16).substring(2, 66)}`
        
        setDeployments(prev => prev.map(d => 
          d.id === pendingDeployment.id 
            ? { ...d, address: fakeAddress, txHash: fakeTxHash, status: "deployed" }
            : d
        ))
        showNotification("success", `[DEMO MODE] Contract deployed to ${fakeAddress}`)
      } else {
        // Production: show actual error
        setDeployments(prev => prev.map(d => 
          d.id === pendingDeployment.id 
            ? { ...d, status: "failed", errorMessage: "Network error - deployment failed" }
            : d
        ))
        showNotification("error", "Deployment failed - check network connection")
      }
    } finally {
      setDeploying(false)
    }
  }

  const getChain = (chainId: number) => chains.find(c => c.id === chainId)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case "deploying": return <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
      case "failed": return <XCircle className="w-5 h-5 text-red-400" />
      default: return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Contract Deployment
            </h1>
            <p className="text-slate-400 mt-1">Deploy smart contracts to supported EVM chains</p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            notification.type === "success" 
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}>
            {notification.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="flex-1">{notification.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deployment Form */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              Deploy New Contract
            </h2>

            <div className="space-y-4">
              {/* Contract Name */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Contract Name</label>
                <input
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  placeholder="MyContract"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Chain Selector */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Chain</label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {chains.map(chain => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Code */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Solidity Source Code</label>
                <textarea
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  placeholder="// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyContract {
    // Your code here
}"
                />
              </div>

              {/* Constructor Args */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Constructor Arguments (comma-separated)</label>
                <input
                  value={constructorArgs}
                  onChange={(e) => setConstructorArgs(e.target.value)}
                  placeholder="arg1, arg2, arg3"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Deploy Button */}
              <button
                onClick={deployContract}
                disabled={deploying}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {deploying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Deploy Contract
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                ⚠️ Make sure ADMIN_PRIVATE_KEY is configured in .env for actual deployments
              </p>
            </div>
          </div>

          {/* Deployments List */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              Recent Deployments
            </h2>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                Loading deployments...
              </div>
            ) : deployments.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                No deployments yet
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {deployments.map((deployment) => {
                  const chain = getChain(deployment.chainId)
                  return (
                    <div
                      key={deployment.id}
                      className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(deployment.status)}
                          <span className="font-semibold text-white">{deployment.name}</span>
                        </div>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: `${chain?.color}20`, color: chain?.color }}
                        >
                          {chain?.name}
                        </span>
                      </div>

                      {deployment.address && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-500">Address:</span>
                          <code className="text-xs text-emerald-400 font-mono">
                            {deployment.address.slice(0, 10)}...{deployment.address.slice(-8)}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deployment.address!, deployment.id)}
                            className="text-slate-500 hover:text-emerald-400"
                          >
                            {copiedAddress === deployment.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={`${chain?.explorer}/address/${deployment.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-cyan-400"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {deployment.txHash && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">TX:</span>
                          <code className="text-xs text-slate-400 font-mono">
                            {deployment.txHash.slice(0, 10)}...{deployment.txHash.slice(-8)}
                          </code>
                          <a
                            href={`${chain?.explorer}/tx/${deployment.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-cyan-400"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {deployment.errorMessage && (
                        <div className="mt-2 p-2 bg-red-500/10 rounded text-xs text-red-400">
                          {deployment.errorMessage}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(deployment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chain Info */}
        <div className="mt-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-400" />
            Supported Chains
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {chains.map(chain => (
              <div
                key={chain.id}
                className="p-3 bg-slate-800/30 rounded-lg text-center border border-slate-700/30"
              >
                <div
                  className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-2"
                  style={{ backgroundColor: `${chain.color}20`, color: chain.color }}
                >
                  {chain.icon}
                </div>
                <div className="text-sm text-white">{chain.name}</div>
                <div className="text-xs text-slate-500 mt-1">ID: {chain.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
