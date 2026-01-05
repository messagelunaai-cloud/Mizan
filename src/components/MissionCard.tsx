import React from 'react';
import { motion } from 'framer-motion';
import { Star, Target, Zap, Trophy } from 'lucide-react';

export interface MissionOrAchievement {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  progress: number;
  max: number;
  points: number;
  completed: boolean;
  type: 'mission' | 'achievement';
}

export function MissionCard({ mission }: { mission: MissionOrAchievement }) {
  const percentage = Math.round((mission.progress / mission.max) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 border rounded-lg transition-all duration-300 ${
        mission.completed 
          ? 'border-[#2d4a3a] bg-[#1a2f23]/50' 
          : 'border-[#1a1a1d] bg-[#0a0a0b]'
      } hover:border-[#2d4a3a] group`}
    >
      <div className="flex items-start gap-3 mb-3">
        <motion.div
          className={`p-2 rounded-md flex-shrink-0 ${
            mission.completed 
              ? 'bg-[#2d4a3a]' 
              : 'bg-[#0e0e10] group-hover:bg-[#1a2f23]'
          }`}
          animate={mission.completed ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {mission.icon || <Star className="w-4 h-4 text-[#3dd98f]" />}
        </motion.div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${mission.completed ? 'text-[#6a6a6d]' : 'text-[#c4c4c6]'}`}>
            {mission.title}
          </p>
          <p className="text-xs text-[#6a6a6d]">+{mission.points} points</p>
        </div>
        {mission.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-[#2d4a3a]"
          >
            <Star className="w-4 h-4 fill-current" />
          </motion.div>
        )}
      </div>
      
      {!mission.completed && (
        <>
          <p className="text-xs text-[#4a4a4d] mb-2">{mission.description}</p>
          <div className="w-full h-1.5 bg-[#0e0e10] rounded-full overflow-hidden border border-[#1a1a1d]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2d4a3a] to-[#3dd98f]"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#4a4a4d]">
              {mission.progress}/{mission.max}
            </span>
            <span className="text-xs text-[#4a4a4d]">{percentage}%</span>
          </div>
        </>
      )}
    </motion.div>
  );
}
