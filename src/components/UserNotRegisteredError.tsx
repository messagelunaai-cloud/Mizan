import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[#1a1a1d] border border-[#2a2a2d]">
          <AlertCircle className="w-10 h-10 text-[#8a8a8d]" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-light tracking-wide text-[#c4c4c6]">Access Restricted</h1>
          <p className="text-[#6a6a6d] text-base leading-relaxed">
            You need to be registered to access this page. Please create an account or log in to continue.
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <div className="p-4 bg-[#0e0e10] border border-[#1a1a1d] rounded text-left">
            <p className="text-[#4a4a4d] text-sm mb-3">If you believe this is an error:</p>
            <ul className="space-y-2 text-[#6a6a6d] text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#8a8a8d] mt-0.5">•</span>
                <span>Verify you are logged in with the correct account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8a8a8d] mt-0.5">•</span>
                <span>Try logging out and back in again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8a8a8d] mt-0.5">•</span>
                <span>Clear your browser cache and cookies</span>
              </li>
            </ul>
          </div>

          <Link
            to="/access"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#2a2a2d] hover:border-[#3a3a3d] text-[#8a8a8d] hover:text-[#c4c4c6] text-sm tracking-wide transition-all duration-300"
          >
            Go to Access Page
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
