import React from 'react';

interface CycleGridProps {
  filled: number; // 0-7
  label?: string;
}

export function CycleGrid({ filled, label }: CycleGridProps) {
  const clamped = Math.max(0, Math.min(7, filled));
  return (
    <div className="p-6 border border-[#1a1a1d] bg-[#0a0a0b]">
      {label && <p className="text-[#c4c4c6] text-sm tracking-wide mb-4">{label}</p>}
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: 7 }).map((_, idx) => {
          const filledCell = idx < clamped;
          return (
            <div key={idx} className="relative">
              <div
                className={`w-9 h-9 md:w-10 md:h-10 border transition-all duration-300 ${
                  filledCell ? 'border-[#2d4a3a] bg-[#1a2f23]/50' : 'border-[#1a1a1d] bg-transparent'
                }`}
              />
              <p className="text-[#2a2a2d] text-[10px] text-center mt-2 tracking-wide">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
