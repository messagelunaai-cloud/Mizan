import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCycle } from '@/hooks/useCycle';
import { CycleGrid } from '@/components/CycleGrid';
import { createPageUrl } from '@/utils/urls';

export default function Cycle() {
  const navigate = useNavigate();
  const { cycles, cyclesCompleted, currentProgress } = useCycle();
  const previous = cycles.length > 1 ? cycles[cycles.length - 2] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-6 py-12 md:py-20">
      <div className="max-w-lg mx-auto">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-8">
          <motion.h1 
            className="text-[#c4c4c6] text-xl tracking-wide mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Cycles
          </motion.h1>
          <motion.p 
            className="text-[#4a4a4d] text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Seven completed days = one cycle.
          </motion.p>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ borderColor: ['#1a1a1d', '#2a2a2d', '#1a1a1d'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CycleGrid filled={currentProgress} label={`Current (${currentProgress}/7)`} />
            </motion.div>
          </motion.div>
          
          {previous && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <CycleGrid filled={previous.days.length} label={`Previous (${previous.days.length}/7)`} />
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: previous ? 1.1 : 0.95 }}
          className="mt-16 flex items-center justify-center gap-8"
        >
          <Link
            to={createPageUrl('CheckIn')}
            className="text-[#3a3a3d] hover:text-[#6a6a6d] text-xs tracking-wide transition-colors duration-300"
          >
            Daily check-in
          </Link>
          <div className="w-1 h-1 bg-[#2a2a2d] rounded-full" />
          <Link
            to={createPageUrl('Status')}
            className="text-[#3a3a3d] hover:text-[#6a6a6d] text-xs tracking-wide transition-colors duration-300"
          >
            Status
          </Link>
          <div className="w-1 h-1 bg-[#2a2a2d] rounded-full" />
          <Link
            to={createPageUrl('Settings')}
            className="text-[#3a3a3d] hover:text-[#6a6a6d] text-xs tracking-wide transition-colors duration-300"
          >
            Settings
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
