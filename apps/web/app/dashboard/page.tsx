'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Compass, Gift, Wallet, Settings, LogOut, 
  Search, Bell, User, ChevronRight, Lock, Play, CheckCircle,
  Award, Zap, Flame, TrendingUp, Clock, Users
} from 'lucide-react';

export default function CastQuestUserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [userStats, setUserStats] = useState({
    level: 8,
    xp: 2450,
    xpMax: 5000,
    coins: 12500,
    gems: 842,
    streakDays: 14
  });

  const [frames, setFrames] = useState([
    {
      id: 1,
      name: 'Dragon\'s Quest',
      progress: 75,
      difficulty: 'Hard',
      reward: 500,
      completed: false,
      image: '🐉'
    },
    {
      id: 2,
      name: 'Forest Explorer',
      progress: 45,
      difficulty: 'Medium',
      reward: 300,
      completed: false,
      image: '🌲'
    },
    {
      id: 3,
      name: 'Treasure Hunt',
      progress: 100,
      difficulty: 'Easy',
      reward: 150,
      completed: true,
      image: '💎'
    },
    {
      id: 4,
      name: 'Sky Walker',
      progress: 60,
      difficulty: 'Hard',
      reward: 600,
      completed: false,
      image: '☁️'
    }
  ]);

  const [quests, setQuests] = useState([
    {
      id: 1,
      title: 'Daily Login',
      description: 'Log in to CastQuest',
      reward: 50,
      xp: 100,
      completed: true,
      category: 'daily'
    },
    {
      id: 2,
      title: 'Complete 3 Frames',
      description: 'Finish any 3 quest frames',
      reward: 200,
      xp: 500,
      completed: false,
      category: 'weekly'
    },
    {
      id: 3,
      title: 'Reach Level 10',
      description: 'Gain enough XP to level up',
      reward: 500,
      xp: 1000,
      completed: false,
      category: 'milestone'
    },
    {
      id: 4,
      title: 'Mint Collector',
      description: 'Collect 10 NFT Mints',
      reward: 300,
      xp: 600,
      completed: false,
      category: 'daily'
    }
  ]);

  const [mints, setMints] = useState([
    { id: 1, name: 'Legendary Dragon', rarity: 'Legendary', date: '2024-01-03', value: 2500 },
    { id: 2, name: 'Golden Sword', rarity: 'Rare', date: '2024-01-02', value: 800 },
    { id: 3, name: 'Forest Crown', rarity: 'Uncommon', date: '2024-01-01', value: 300 },
    { id: 4, name: 'Crystal Orb', rarity: 'Rare', date: '2023-12-28', value: 650 }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, username: 'DragonSlayer', level: 15, xp: 45000, coins: 50000 },
    { rank: 2, username: 'SkyWalker', level: 14, xp: 42000, coins: 48000 },
    { rank: 3, username: 'YourName', level: 8, xp: 2450, coins: 12500 },
    { rank: 4, username: 'TreasureHunt', level: 12, xp: 38000, coins: 42000 },
    { rank: 5, username: 'MintCollector', level: 11, xp: 35000, coins: 40000 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins + Math.floor(Math.random() * 50),
        xp: Math.min(prev.xpMax, prev.xp + Math.floor(Math.random() * 30))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const completeQuest = (questId: number) => {
    setQuests(quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ));
  };

  const completeFrame = (frameId: number) => {
    setFrames(frames.map(f => 
      f.id === frameId ? { ...f, completed: true, progress: 100 } : f
    ));
  };

  // Home Page Component
  const HomePage = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl p-8 text-white shadow-lg shadow-purple-500/20">
        <h2 className="text-3xl font-bold mb-2">Welcome Back, Adventurer! 👋</h2>
        <p className="text-purple-100">You&apos;re on a {userStats.streakDays} day streak! Keep it up!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Level</p>
              <p className="text-3xl font-bold text-purple-400">{userStats.level}</p>
            </div>
            <Award className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/5 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Coins</p>
              <p className="text-3xl font-bold text-cyan-400">{userStats.coins.toLocaleString()}</p>
            </div>
            <Wallet className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-white/5 border border-pink-500/30 rounded-lg p-4 hover:border-pink-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Gems</p>
              <p className="text-3xl font-bold text-pink-400">{userStats.gems}</p>
            </div>
            <Gift className="w-8 h-8 text-pink-400" />
          </div>
        </div>

        <div className="bg-white/5 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Streak</p>
              <p className="text-3xl font-bold text-orange-400">{userStats.streakDays}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-white/5 border border-purple-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Experience Progress</h3>
          <span className="text-sm text-gray-400">{userStats.xp} / {userStats.xpMax} XP</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
            style={{ width: `${(userStats.xp / userStats.xpMax) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">{userStats.xpMax - userStats.xp} XP to next level</p>
      </div>

      {/* Featured Frames */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Featured Frames</h3>
          <button 
            onClick={() => setCurrentPage('frames')}
            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frames.slice(0, 2).map(frame => (
            <div key={frame.id} className="bg-white/5 border border-cyan-500/30 rounded-lg p-4 hover:bg-white/10 hover:border-cyan-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{frame.image}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  frame.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  frame.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  {frame.difficulty}
                </span>
              </div>
              <h4 className="font-semibold mb-2">{frame.name}</h4>
              <div className="w-full bg-black/40 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all shadow-lg shadow-cyan-500/50"
                  style={{ width: `${frame.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{frame.progress}%</span>
                <button 
                  onClick={() => completeFrame(frame.id)}
                  className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 transition-all"
                >
                  {frame.progress === 100 ? '✓ Done' : 'Play'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Quest Action */}
      <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg p-6 text-white shadow-lg shadow-cyan-500/20">
        <h3 className="font-bold mb-2">Daily Quest Ready!</h3>
        <p className="text-sm mb-4">Complete your daily login quest to earn coins and XP</p>
        <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg py-2 font-semibold transition-all">
          Claim Reward →
        </button>
      </div>
    </div>
  );

  // Frames Page Component
  const FramesPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quest Frames</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {frames.map(frame => (
          <div key={frame.id} className="bg-white/5 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <div className="text-6xl mb-4 text-center">{frame.image}</div>
            <h3 className="text-xl font-bold mb-2">{frame.name}</h3>
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-1 rounded font-semibold ${
                frame.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                frame.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {frame.difficulty}
              </span>
              <span className="text-xs text-gray-400">⭐ {frame.reward} coins</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="font-semibold">{frame.progress}%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all shadow-lg shadow-purple-500/50"
                  style={{ width: `${frame.progress}%` }}
                />
              </div>
            </div>

            <button 
              onClick={() => completeFrame(frame.id)}
              className={`w-full py-2 rounded-lg font-semibold border transition-all ${
                frame.completed 
                  ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                  : 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-300'
              }`}
            >
              {frame.completed ? '✓ Completed' : `${frame.progress === 100 ? 'Claim' : 'Continue'}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Quests Page Component
  const QuestsPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quests & Challenges</h2>
      
      <div className="space-y-3">
        {quests.map(quest => (
          <div key={quest.id} className="bg-white/5 border border-cyan-500/30 rounded-lg p-4 hover:bg-white/10 hover:border-cyan-500/50 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{quest.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    quest.category === 'daily' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    quest.category === 'weekly' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{quest.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm flex items-center gap-1">
                    <Wallet className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400">+{quest.reward}</span>
                  </span>
                  <span className="text-sm flex items-center gap-1">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400">+{quest.xp} XP</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => completeQuest(quest.id)}
                disabled={quest.completed}
                className={`px-6 py-2 rounded-lg font-semibold border transition-all whitespace-nowrap ${
                  quest.completed
                    ? 'bg-green-500/20 border-green-500/50 text-green-300 cursor-not-allowed'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
                }`}
              >
                {quest.completed ? '✓ Done' : 'Claim'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Mints Page Component
  const MintsPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My NFT Mints</h2>
      
      <div className="bg-white/5 border border-cyan-500/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-400">Total Value: <span className="text-cyan-400 font-semibold">4,250 coins</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mints.map(mint => (
          <div key={mint.id} className="bg-white/5 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{mint.name}</h3>
                <p className="text-sm text-gray-400">{mint.date}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded font-bold ${
                mint.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                mint.rarity === 'Rare' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {mint.rarity}
              </span>
            </div>
            <div className="w-full h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center border border-purple-500/30">
              <span className="text-4xl">✨</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-cyan-400">{mint.value} coins</span>
              <button className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 text-sm font-semibold transition-all">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Leaderboard Page Component
  const LeaderboardPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Global Leaderboard</h2>
      
      <div className="space-y-2">
        {leaderboard.map(player => (
          <div 
            key={player.rank} 
            className={`rounded-lg p-4 border transition-all ${
              player.rank === 3
                ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'bg-white/5 border-cyan-500/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                  player.rank === 1 ? 'bg-yellow-500/30 text-yellow-300 shadow-lg shadow-yellow-500/30' :
                  player.rank === 2 ? 'bg-gray-400/30 text-gray-300' :
                  player.rank === 3 ? 'bg-orange-500/30 text-orange-300' :
                  'bg-cyan-500/20 text-cyan-300'
                }`}>
                  {player.rank}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{player.username}</p>
                  <p className="text-sm text-gray-400">Level {player.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8">
                <div className="text-right">
                  <p className="text-sm text-gray-400">XP</p>
                  <p className="font-bold text-cyan-400">{player.xp.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Coins</p>
                  <p className="font-bold text-purple-400">{player.coins.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Settings Page Component
  const SettingsPage = () => (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="bg-white/5 border border-cyan-500/30 rounded-lg divide-y divide-white/10">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Account</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Edit Profile</button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Quest Updates</span>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2">Privacy</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Settings</button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2">Security</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors">
            <Lock className="w-4 h-4" /> Change Password
          </button>
        </div>
      </div>

      <button className="w-full py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-semibold transition-all">
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white" style={{
      backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0a0a1a 100%)',
      boxShadow: 'inset 0 0 100px rgba(0, 255, 150, 0.05)'
    }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/80 backdrop-blur border-r border-cyan-500/20 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative`}>
          <div className="p-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30">
                CQ
              </div>
              <h1 className="text-xl font-bold">CastQuest</h1>
            </div>
          </div>

          <nav className="p-6 space-y-4">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'frames', label: 'Quest Frames', icon: Compass },
              { id: 'quests', label: 'Quests', icon: Play },
              { id: 'mints', label: 'My Mints', icon: Gift },
              { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="border-b border-cyan-500/20 bg-black/40 backdrop-blur sticky top-0 z-40">
            <div className="px-6 py-4 flex items-center justify-between">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search frames, quests..." 
                    className="w-full bg-white/5 border border-cyan-500/30 rounded-lg pl-10 pr-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow">
                  U
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8">
              {currentPage === 'home' && <HomePage />}
              {currentPage === 'frames' && <FramesPage />}
              {currentPage === 'quests' && <QuestsPage />}
              {currentPage === 'mints' && <MintsPage />}
              {currentPage === 'leaderboard' && <LeaderboardPage />}
              {currentPage === 'settings' && <SettingsPage />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}