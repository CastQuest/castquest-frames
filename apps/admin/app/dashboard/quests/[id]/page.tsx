'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, ArrowLeft, Trophy, Users, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function QuestDetailPage() {
  const params = useParams();
  const questId = params.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard/quests">
          <button className="mb-6 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Quests
          </button>
        </Link>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Quest Details: {questId}
          </h1>
          <p className="text-slate-400">Detailed information about this quest</p>
        </motion.div>
      </div>
    </div>
  );
}
