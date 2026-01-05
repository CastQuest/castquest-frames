'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BarChart3,
  Users,
  ShoppingBag,
  Zap,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Award,
  Crown,
  Rocket,
  Target,
  DollarSign,
  Settings,
  Plus,
  Filter,
  Search,
  ArrowUpRight,
  Lightbulb,
  Wand2,
  Image,
  Video,
  Code,
  Palette,
  Download,
  ExternalLink,
  Star,
  Flame,
  Gift,
  Trophy,
  Clock,
  ChevronRight,
  Bell,
  TrendingDown,
} from 'lucide-react';

interface Frame {
  id: string;
  name: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  revenue: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

interface Stat {
  label: string;
  value: string;
  change: number;
  icon: any;
  trend: 'up' | 'down';
}

interface Template {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  downloads: number;
  thumbnail: string;
  featured: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  badges: string[];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-builder' | 'analytics' | 'community' | 'marketplace'>('overview');
  const [frames, setFrames] = useState<Frame[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data initialization
  useEffect(() => {
    setFrames([
      {
        id: '1',
        name: 'Interactive Poll Frame',
        thumbnail: '/frames/poll.jpg',
        views: 12500,
        likes: 890,
        comments: 156,
        shares: 234,
        revenue: 450.50,
        status: 'active',
        createdAt: '2026-01-01',
      },
      {
        id: '2',
        name: 'NFT Showcase',
        thumbnail: '/frames/nft.jpg',
        views: 8900,
        likes: 670,
        comments: 89,
        shares: 145,
        revenue: 320.75,
        status: 'active',
        createdAt: '2025-12-28',
      },
      {
        id: '3',
        name: 'Quiz Challenge',
        thumbnail: '/frames/quiz.jpg',
        views: 6700,
        likes: 450,
        comments: 67,
        shares: 89,
        revenue: 180.25,
        status: 'draft',
        createdAt: '2025-12-25',
      },
    ]);

    setTemplates([
      {
        id: '1',
        name: 'Gamer Profile Card',
        category: 'Social',
        price: 49,
        rating: 4.8,
        downloads: 1234,
        thumbnail: '/templates/gamer.jpg',
        featured: true,
      },
      {
        id: '2',
        name: 'Token Launch Frame',
        category: 'DeFi',
        price: 99,
        rating: 4.9,
        downloads: 856,
        thumbnail: '/templates/token.jpg',
        featured: true,
      },
      {
        id: '3',
        name: 'Event RSVP',
        category: 'Events',
        price: 29,
        rating: 4.7,
        downloads: 2341,
        thumbnail: '/templates/event.jpg',
        featured: false,
      },
      {
        id: '4',
        name: 'Music Player',
        category: 'Entertainment',
        price: 39,
        rating: 4.6,
        downloads: 1890,
        thumbnail: '/templates/music.jpg',
        featured: false,
      },
    ]);

    setCommunityPosts([
      {
        id: '1',
        author: 'CryptoCreator',
        avatar: '/avatars/user1.jpg',
        content: 'Just launched my first interactive frame! The AI builder made it so easy. Check it out! 🚀',
        likes: 234,
        comments: 45,
        timestamp: '2h ago',
        badges: ['Early Adopter', 'Top Creator'],
      },
      {
        id: '2',
        author: 'FrameMaster',
        avatar: '/avatars/user2.jpg',
        content: 'Pro tip: Use the analytics dashboard to optimize your frame engagement. Increased my CTR by 40%! 📊',
        likes: 189,
        comments: 32,
        timestamp: '5h ago',
        badges: ['Expert', 'Verified'],
      },
      {
        id: '3',
        author: 'NFTArtist',
        avatar: '/avatars/user3.jpg',
        content: 'My NFT gallery frame just hit 10k views! Thanks to the CastQuest community for all the support 🎨✨',
        likes: 567,
        comments: 78,
        timestamp: '1d ago',
        badges: ['Top Seller', 'Artist'],
      },
    ]);
  }, []);

  const stats: Stat[] = [
    {
      label: 'Total Views',
      value: '28.1K',
      change: 12.5,
      icon: Eye,
      trend: 'up',
    },
    {
      label: 'Engagement Rate',
      value: '8.4%',
      change: 3.2,
      icon: Heart,
      trend: 'up',
    },
    {
      label: 'Total Revenue',
      value: '$951.50',
      change: 18.7,
      icon: DollarSign,
      trend: 'up',
    },
    {
      label: 'Active Frames',
      value: '12',
      change: 2,
      icon: Zap,
      trend: 'up',
    },
  ];

  const aiFeatures = [
    {
      icon: Wand2,
      title: 'AI Frame Generator',
      description: 'Describe your frame and let AI create it',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Palette,
      title: 'Smart Design',
      description: 'AI-powered color schemes and layouts',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Lightbulb,
      title: 'Content Ideas',
      description: 'Get AI suggestions for engaging content',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      icon: Code,
      title: 'Code Assistant',
      description: 'AI helps with custom interactions',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Creator Dashboard
              </h1>
              <p className="text-slate-400">Welcome back, @SMSDAO! Ready to create something amazing?</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Frame</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/20">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'ai-builder', label: 'AI Builder', icon: Sparkles },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'community', label: 'Community', icon: Users },
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                        <stat.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {stat.change}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Rocket className="w-6 h-6 text-purple-400" />
                      Your Frames
                    </h2>
                    <div className="flex gap-2">
                      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all">
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {frames.map((frame, index) => (
                      <motion.div
                        key={frame.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Image className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-white font-semibold truncate">{frame.name}</h3>
                              <span className={`px-2 py-1 rounded text-xs ${
                                frame.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : frame.status === 'draft'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-slate-500/20 text-slate-400'
                              }`}>
                                {frame.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {frame.views.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {frame.likes.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {frame.comments}
                              </span>
                              <span className="flex items-center gap-1 text-green-400">
                                <DollarSign className="w-4 h-4" />
                                {frame.revenue.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <button className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Achievement Card */}
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Achievements</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">Top Creator</div>
                        <div className="text-slate-400 text-xs">Rank #234</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">7 Day Streak</div>
                        <div className="text-slate-400 text-xs">Keep it up!</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">15 Badges Earned</div>
                        <div className="text-slate-400 text-xs">View all</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Avg. Frame Score</span>
                      <span className="text-white font-semibold">8.6/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Total Interactions</span>
                      <span className="text-white font-semibold">45.2K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Conversion Rate</span>
                      <span className="text-green-400 font-semibold">12.3%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* AI Builder Tab */}
        {activeTab === 'ai-builder' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20 rounded-xl blur-xl group-hover:blur-2xl transition-all`} />
                  <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                        <p className="text-slate-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all flex items-center justify-center gap-2">
                      Try Now
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Frame Generator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">AI Frame Generator</h2>
                <p className="text-slate-400">Describe your frame idea and let AI bring it to life</p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <textarea
                  placeholder="E.g., 'Create an interactive poll frame for choosing the next community event with a futuristic purple theme and emoji reactions...'"
                  className="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Add Image
                    </button>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Add Video
                    </button>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25">
                    <Sparkles className="w-5 h-5" />
                    Generate Frame
                  </button>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    10K+
                  </div>
                  <div className="text-slate-400">Frames Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    98%
                  </div>
                  <div className="text-slate-400">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    &lt;30s
                  </div>
                  <div className="text-slate-400">Avg. Generation Time</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Engagement Trend</h3>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">+24.5%</div>
                <div className="text-sm text-slate-400">vs last week</div>
                <div className="mt-4 h-24 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 85, 70].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Top Performing</h3>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Interactive Poll</span>
                    <span className="text-white font-semibold">12.5K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">NFT Showcase</span>
                    <span className="text-white font-semibold">8.9K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Quiz Challenge</span>
                    <span className="text-white font-semibold">6.7K</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Revenue Growth</h3>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">$951.50</div>
                <div className="text-sm text-green-400 mb-4">+18.7% this month</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Goal: $1,200</span>
                  <span className="text-white font-semibold">79%</span>
                </div>
                <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Audience Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Returning Visitors</span>
                      <span className="text-white font-semibold">68%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">New Visitors</span>
                      <span className="text-white font-semibold">32%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Avg. Session Time</span>
                      <span className="text-white font-semibold">4m 32s</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Eye className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">New milestone reached</div>
                      <div className="text-slate-400 text-xs">10K views on Interactive Poll</div>
                      <div className="text-slate-500 text-xs mt-1">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Heart className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Engagement spike</div>
                      <div className="text-slate-400 text-xs">NFT Showcase trending</div>
                      <div className="text-slate-500 text-xs mt-1">5 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <DollarSign className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Revenue update</div>
                      <div className="text-slate-400 text-xs">$145 earned today</div>
                      <div className="text-slate-500 text-xs mt-1">1 day ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {communityPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                        {post.author[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-semibold">{post.author}</span>
                          <span className="text-slate-500 text-sm">{post.timestamp}</span>
                          {post.badges.map((badge) => (
                            <span
                              key={badge}
                              className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                        <p className="text-slate-300 mb-4">{post.content}</p>
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-all">
                            <Heart className="w-5 h-5" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-all">
                            <MessageSquare className="w-5 h-5" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-all">
                            <Share2 className="w-5 h-5" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    Top Creators
                  </h3>
                  <div className="space-y-3">
                    {['FrameMaster', 'CryptoCreator', 'NFTArtist'].map((creator, i) => (
                      <div key={creator} className="flex items-center gap-3">
                        <div className="text-slate-400 font-bold text-lg w-6">#{i + 1}</div>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                          {creator[0]}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-sm">{creator}</div>
                          <div className="text-slate-400 text-xs">{(1234 - i * 200).toLocaleString()} pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {['#AIFrames', '#NFTShowcase', '#InteractivePoll', '#Web3Design'].map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer"
                      >
                        <span className="text-purple-400 font-medium">{tag}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-pink-400" />
                    Community Events
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                      <div className="text-white font-semibold text-sm mb-1">Frame Contest</div>
                      <div className="text-purple-400 text-xs">Ends in 3 days</div>
                    </div>
                    <div className="p-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
                      <div className="text-white font-semibold text-sm mb-1">Creator Workshop</div>
                      <div className="text-cyan-400 text-xs">Tomorrow at 2PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/20">
                {['All', 'Social', 'DeFi', 'NFT', 'Gaming', 'Events'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter.toLowerCase())}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      selectedFilter === filter.toLowerCase()
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {template.featured && (
                    <div className="absolute -top-2 -right-2 z-10 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
                    <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Image className="w-16 h-16 text-white/50" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-100 transition-all">
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{template.name}</h3>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                          {template.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {template.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {template.downloads.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">${template.price}</span>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all">
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/50 rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Want to sell your frames?</h3>
              <p className="text-slate-300 mb-4">Join our marketplace and earn from your creations</p>
              <button className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all flex items-center gap-2 mx-auto">
                Become a Seller
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
