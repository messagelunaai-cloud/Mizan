import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChecklistItemProps {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  delay?: number;
  disabled?: boolean;
}

export function ChecklistItem({ label, description, checked, onToggle, delay = 0, disabled }: ChecklistItemProps) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay }}>
      <button
        onClick={disabled ? undefined : onToggle}
        aria-pressed={checked}
        className={`w-full group relative flex items-center gap-5 p-5 border transition-all duration-300 ${
          checked ? 'bg-[#0e0e10] border-[#2d4a3a]/40' : 'bg-transparent border-[#1a1a1d] hover:border-[#2a2a2d]'
        } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        <div
          className={`w-5 h-5 border flex items-center justify-center transition-all duration-300 ${
            checked ? 'border-[#2d4a3a] bg-[#1a2f23]' : 'border-[#2a2a2d] group-hover:border-[#3a3a3d]'
          }`}
        >
          {checked && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Check className="w-3 h-3 text-[#4a7a5a]" />
            </motion.div>
          )}
        </div>

        <div className="flex-1 text-left">
          <p className={`text-sm tracking-wide transition-colors duration-300 ${checked ? 'text-[#6a6a6d]' : 'text-[#c4c4c6]'}`}>
            {label}
          </p>
          <p className={`text-xs mt-1 transition-colors duration-300 ${checked ? 'text-[#3a3a3d]' : 'text-[#4a4a4d]'}`}>
            {description}
          </p>
        </div>

        {checked && <div className="w-1 h-1 bg-[#2d4a3a] rounded-full" />}
      </button>
    </motion.div>
  );
}
