import React from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Award } from 'lucide-react';

export type RankTitle = 'Ghāfil' | 'Muntabih' | 'Multazim' | 'Muwāẓib' | 'Muhāsib' | 'Muttazin';

interface RankDisplayProps {
  rank: RankTitle;
  completedDays: number;
  cyclesCompleted: number;
  nextRankIn?: number;
}

const rankEmojis: Record<RankTitle, string> = {
  'Ghāfil': '😴',
  'Muntabih': '👁️',
  'Multazim': '🎯',
  'Muwāẓib': '⚡',
  'Muhāsib': '🔥',
  'Muttazin': '👑'
};

const rankLabels: Record<RankTitle, string> = {
  'Ghāfil': 'The Heedless',
  'Muntabih': 'The Aware',
  'Multazim': 'The Committed',
  'Muwāẓib': 'The Regular',
  'Muhāsib': 'The Accountable',
  'Muttazin': 'The Steadfast'
};

const rankThresholds = [
  { rank: 'Ghāfil' as RankTitle, days: 0, cycles: 0 },
  { rank: 'Muntabih' as RankTitle, days: 1, cycles: 0 },
  { rank: 'Multazim' as RankTitle, days: 0, cycles: 1 },
  { rank: 'Muwāẓib' as RankTitle, days: 0, cycles: 3 },
  { rank: 'Muhāsib' as RankTitle, days: 0, cycles: 7 },
  { rank: 'Muttazin' as RankTitle, days: 30, cycles: 0 }
];

export function RankDisplay({ rank, completedDays, cyclesCompleted }: RankDisplayProps) {
  const currentIndex = rankThresholds.findIndex(r => r.rank === rank);
  const nextRank = rankThresholds[currentIndex + 1];
  
  let progressToNext = 0;
  let progressLabel = '';
  
  if (nextRank) {
    if (nextRank.days > 0) {
      progressToNext = Math.min((completedDays / nextRank.days) * 100, 100);
      progressLabel = `${completedDays}/${nextRank.days} days`;
    } else if (nextRank.cycles > 0) {
      progressToNext = Math.min((cyclesCompleted / nextRank.cycles) * 100, 100);
      progressLabel = `${cyclesCompleted}/${nextRank.cycles} cycles`;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 border border-[#1a1a1d] bg-gradient-to-br from-[#0a0a0b] to-[#0e0e10] rounded-lg"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          {rankEmojis[rank]}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-[#3dd98f]" />
            <p className="text-[#c4c4c6] font-semibold">{rankLabels[rank]}</p>
          </div>
          <p className="text-xs text-[#6a6a6d]">{rank}</p>
        </div>
      </div>

      {nextRank && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4a4a4d]">Progress to {rankLabels[nextRank.rank]}</span>
            <span className="text-xs text-[#6a6a6d]">{Math.round(progressToNext)}%</span>
          </div>
          <div className="w-full h-2 bg-[#0e0e10] rounded-full overflow-hidden border border-[#1a1a1d]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2d4a3a] to-[#3dd98f]"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-[#4a4a4d]">{progressLabel}</p>
        </div>
      )}

      {!nextRank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 text-[#3dd98f] text-sm"
        >
          <Award className="w-4 h-4" />
          <span>Highest Rank Achieved!</span>
        </motion.div>
      )}
    </motion.div>
  );
}
