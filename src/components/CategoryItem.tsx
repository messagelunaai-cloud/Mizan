import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

interface CategoryItemProps {
  title: string;
  description: string;
  completed: boolean;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onHeaderClick?: () => void;
  expanded?: boolean;
  icon?: React.ReactNode;
  iconColor?: string;
}

export function CategoryItem({
  title,
  description,
  completed,
  required = false,
  disabled = false,
  children,
  onHeaderClick,
  expanded: externalExpanded,
  icon,
  iconColor
}: CategoryItemProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;

  const handleToggle = () => {
    if (disabled) return;
    if (onHeaderClick) {
      onHeaderClick();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <div
      className={`surface-card transition-all duration-300 ${
        completed ? 'border-[rgba(47,111,75,0.5)]' : 'border-[rgba(28,30,34,0.8)]'
      }`}
    >
      <button
        onClick={handleToggle}
        className={`w-full p-5 flex items-center gap-4 text-left transition-colors duration-300 ${disabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#0a0a0b]'}`}
        disabled={disabled}
      >
        {icon && (
          <div className={`p-2 rounded-md ${iconColor || 'bg-gray-500/10'}`}>
            {icon}
          </div>
        )}
        <div className={`w-5 h-5 border flex items-center justify-center transition-all duration-300 ${completed ? 'border-[#2d4a3a] bg-[#1a2f23]' : 'border-[#2a2a2d]'}`}>
          {completed && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Check className="w-3 h-3 text-[#4a7a5a]" />
            </motion.div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm tracking-wide transition-colors duration-300 ${completed ? 'text-[#6a6a6d]' : 'text-[#c4c4c6]'}`}>{title}</p>
            {required && <span className="text-[#b45c3c] text-[10px] tracking-wider uppercase">Required</span>}
          </div>
          <p className={`text-xs mt-1 transition-colors duration-300 ${completed ? 'text-[#3a3a3d]' : 'text-[#4a4a4d]'}`}>{description}</p>
        </div>

        {children && (
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-[#3a3a3d]">
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        )}

        {completed && <div className="w-1 h-1 bg-[#2d4a3a] rounded-full" />}
      </button>

      <AnimatePresence>
        {expanded && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-[#1a1a1d]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SubCheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function SubCheckbox({ label, checked, onToggle, disabled }: SubCheckboxProps) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      className={`flex items-center gap-3 py-2 text-sm ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:text-[#c4c4c6]'} ${checked ? 'text-[#8a8a8d]' : 'text-[#5a5a5d]'} transition-colors duration-200`}
    >
      <div className={`w-4 h-4 border flex items-center justify-center ${checked ? 'border-[#2d4a3a] bg-[#1a2f23]' : 'border-[#2a2a2d]'}`}>
        {checked && <Check className="w-2.5 h-2.5 text-[#4a7a5a]" />}
      </div>
      <span>{label}</span>
    </button>
  );
}
