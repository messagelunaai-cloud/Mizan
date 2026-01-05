import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, disabled, className = '', ...rest }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`relative inline-flex w-full items-center justify-center gap-2 rounded-md py-3.5 px-4 text-sm tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden ${
        disabled
          ? 'border border-[#1a1a1d] text-[#4a4a4d] opacity-60 cursor-not-allowed'
          : 'border border-[rgba(47,111,75,0.7)] text-[#d9dfd8] bg-[radial-gradient(circle_at_20%_20%,rgba(47,111,75,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(183,150,82,0.25),transparent_40%),linear-gradient(120deg,#0f1813,#0b0e10)] shadow-[0_12px_40px_rgba(47,111,75,0.18)] hover:shadow-[0_18px_50px_rgba(47,111,75,0.28)] hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6f4b]'
      } ${className}`}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {!disabled && (
        <>
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-md" />
        </>
      )}
    </button>
  );
}
