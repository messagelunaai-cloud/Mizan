import React from 'react';
import { motion } from 'framer-motion';

interface CircleProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export function CircleProgress({ 
  value, 
  max, 
  size = 120,
  strokeWidth = 8,
  label,
  color = '#2d4a3a'
}: CircleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
          className="absolute inset-0"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1a1a1d"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={`${value}-${max}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="text-2xl font-light text-[#c4c4c6]">
              {value}/{max}
            </div>
            <div className="text-xs text-[#6a6a6d]">{percentage}%</div>
          </motion.div>
        </div>
      </div>
      {label && <p className="text-xs text-[#6a6a6d] text-center">{label}</p>}
    </div>
  );
}
