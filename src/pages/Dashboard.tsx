import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Target, Flame, Trophy, TrendingUp, CheckCircle2, AlertCircle, Crown, Lock } from 'lucide-react';
import { createPageUrl } from '@/utils/urls';
import { readCheckins, getTodayKey, countCompletedCategories, readLeaderboard, readUser, readPointsLog } from '@/utils/storage';
import { useCycle } from '@/hooks/useCycle';
import { CircleProgress } from '@/components/CircleProgress';
import { handleStripeRedirect, checkStripeRedirect, isPremiumPending, activatePremium, migrateOldPremiumData } from '@/lib/premium';
import { useClerkAuth } from '@/contexts/ClerkAuthContext';
import { useMizanSession } from '@/contexts/MizanSessionContext';
import { getSummary } from '@/utils/api';

function formatDateLabel(dateKey: string): string {
  if (!dateKey) return '—';
  const [year, month, day] = dateKey.split('-');
  return `${day}/${month}/${year.slice(-2)}`;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      {value}
    </motion.span>
  );
};

function LegacyDashboard() {
  const navigate = useNavigate();
  const { user } = useClerkAuth();
  const { cyclesCompleted, currentProgress } = useCycle();
  const [pendingBannerVisible, setPendingBannerVisible] = useState(false);
  const [showPremiumActivated, setShowPremiumActivated] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationCode, setActivationCode] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  // If we came back from Stripe, mark it so we can handle once user is loaded
  useEffect(() => {
    if (checkStripeRedirect()) {
      sessionStorage.setItem('stripe_redirect_pending', 'true');
      setPendingBannerVisible(true);
    }
  }, []);

  // Sync banner with stored pending flag
  useEffect(() => {
    setPendingBannerVisible(isPremiumPending(user?.id));
  }, [user?.id]);

  // Handle Stripe redirect once user is available
  useEffect(() => {
    if (user?.id && sessionStorage.getItem('stripe_redirect_pending') === 'true') {
      handleStripeRedirect(user.id);
      setPendingBannerVisible(true);
      sessionStorage.removeItem('stripe_redirect_pending');
    }
  }, [user?.id]);

  // Migrate old premium data when user changes
  useEffect(() => {
    if (user?.id) {
      migrateOldPremiumData(user.id);
    }
  }, [user?.id]);

  const handleActivatePremium = async () => {
    setIsActivating(true);

    // Simulate activation process (like Stripe's animation timing)
    await new Promise(resolve => setTimeout(resolve, 800));

    const code = activatePremium(user?.id);
    setPendingBannerVisible(false);
    setActivationCode(code);
    setShowPremiumActivated(true);
    setIsActivating(false);

    // No longer auto-hide - user must click copy or X to close
  };

  const metrics = useMemo(() => {
    const checkins = readCheckins();
    const entries = Object.entries(checkins).sort(([a], [b]) => (a < b ? -1 : 1));
    const todayKey = getTodayKey();
    const todayEntry = checkins[todayKey];

    const submittedDays = entries.filter(([, d]) => d.submitted).length;
    const completedDays = entries.filter(([, d]) => d.completed).length;
    const penaltiesOutstanding = entries.reduce((acc, [, d]) => acc + d.penalties.filter((p) => !p.resolved).length, 0);

    let currentStreak = 0;
    for (let i = entries.length - 1; i >= 0; i -= 1) {
      const [, entry] = entries[i];
      if (entry.completed) {
        currentStreak += 1;
      } else if (entry.submitted) {
        break;
      } else {
        break;
      }
    }

    const lastCompleted = entries.filter(([, d]) => d.completed).pop()?.[0] ?? '';
    const categoriesDone = todayEntry ? countCompletedCategories(todayEntry.categories) : 0;

    let todayStatus = 'Not started';
    let todayHint = 'Begin your daily check-in to log discipline.';
    if (todayEntry?.completed) {
      todayStatus = 'Completed';
      todayHint = 'Today is balanced. See your status or cycles.';
    } else if (todayEntry?.submitted) {
      todayStatus = 'Logged';
      todayHint = 'Submitted but not balanced. Clear any debts if needed.';
    } else if (categoriesDone > 0) {
      todayStatus = 'In progress';
      todayHint = 'You have activity saved. Finish and submit when ready.';
    }

    const leaderboard = readLeaderboard().sort((a, b) => b.points - a.points);
    const user = readUser() || 'guest';
    const yourPoints = leaderboard.find((l) => l.user === user)?.points ?? 0;
    const lastPoints = [...readPointsLog()].pop();

    return {
      todayKey,
      todayStatus,
      todayHint,
      submittedDays,
      completedDays,
      currentStreak,
      penaltiesOutstanding,
      lastCompleted,
      categoriesDone,
      leaderboard,
      yourPoints,
      lastPoints,
      user
    };
  }, [cyclesCompleted]);

  const handlePrimary = () => {
    navigate(createPageUrl('CheckIn'));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#c4c4c6] px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">

        {/* Premium Pending Banner */}
        {(pendingBannerVisible || isPremiumPending(user?.id)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#1a1a1d] border border-[#2a2a2d] rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-[#3dd98f]" />
                <span className="text-sm text-[#c4c4c6]">Payment received. Activate premium to continue.</span>
              </div>
              <button
                onClick={handleActivatePremium}
                disabled={isActivating}
                className="px-4 py-2 bg-[#2d4a3a] hover:bg-[#3d5a4a] disabled:bg-[#2d4a3a] text-[#0a0a0a] text-sm font-medium rounded transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center"
              >
                {isActivating ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center gap-2"
                  >
                    <motion.svg
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0a0a0a]"
                    >
                      <motion.path
                        d="M20 6L9 17L4 12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                      />
                    </motion.svg>
                    <span>Activated</span>
                  </motion.div>
                ) : (
                  <span>Activate Premium</span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Premium Activated Confirmation */}
        {showPremiumActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-[#1a1a1d]/50 border border-[#2d4a3a]/40 rounded-lg relative"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowPremiumActivated(false);
                setActivationCode(null);
                setCopyStatus('idle');
              }}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[#6a6a6d] hover:text-[#c4c4c6] hover:bg-[#2a2a2d] rounded transition-colors"
            >
              ✕
            </button>

            <div className="text-center pr-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-8 h-8 bg-[#3dd98f] rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <Crown className="w-4 h-4 text-[#0a0a0a]" />
              </motion.div>
              <h3 className="text-sm font-medium text-[#3dd98f] mb-2">Premium Activated Successfully!</h3>
              <p className="text-xs text-[#6a6a6d] mb-3">Your premium features are now unlocked for 1 year.</p>

              {activationCode && (
                <div className="bg-[#0a0a0b] border border-[#1a1a1d] p-3 rounded-lg">
                  <p className="text-xs text-[#6a6a6d] mb-2">Save this activation code for backup:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1 bg-[#1a1a1d] text-[#3dd98f] font-mono text-xs rounded border border-[#2a2a2d]">
                      {activationCode}
                    </code>
                    <motion.button
                      onClick={async () => {
                        await navigator.clipboard.writeText(activationCode);
                        setCopyStatus('copied');
                        setTimeout(() => setCopyStatus('idle'), 2000);
                      }}
                      className="px-2 py-1 bg-[#1a1a1d] hover:bg-[#2a2a2d] text-[#c4c4c6] text-xs rounded border border-[#2a2a2d] transition-colors min-w-[60px]"
                      animate={copyStatus === 'copied' ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        key={copyStatus}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
                      </motion.span>
                    </motion.button>
                  </div>
                  <p className="text-xs text-[#6a6a6d] mt-2">Use this code to reactivate premium if needed.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.p 
            className="text-[11px] uppercase tracking-[0.22em] text-[#4a4a4d] mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Today
          </motion.p>
          <motion.div
            className="flex items-center gap-3"
            key={metrics.todayStatus}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {metrics.todayStatus === 'Completed' ? (
              <CheckCircle2 className="w-8 h-8 text-[#3dd98f]" />
            ) : metrics.todayStatus === 'In progress' ? (
              <AlertCircle className="w-8 h-8 text-[#ffa500]" />
            ) : (
              <Calendar className="w-8 h-8 text-[#6a6a6d]" />
            )}
            <h1 className="text-3xl font-light flex items-center gap-2">
              {metrics.todayStatus}
              {metrics.submittedDays > 0 && <Lock className="w-4 h-4 text-[#6a6a6d]" title="Ledger sealed" />}
            </h1>
          </motion.div>
        </motion.div>

        <motion.div 
          className="border border-[#1a1a1d] bg-[#0a0a0b] p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.p 
            className="text-[#6a6a6d] text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {metrics.todayHint}
          </motion.p>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <motion.p 
                className="text-[11px] uppercase tracking-[0.18em] text-[#4a4a4d]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Cycle progress
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex justify-center"
            >
              <CircleProgress 
                value={currentProgress}
                max={7}
                size={140}
                label="days completed"
                color="#3dd98f"
              />
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={handlePrimary}
            className="w-full bg-[#0e0e10] border border-[#1a1a1d] text-[#8a8a8d] py-4 px-5 text-sm tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden"
            whileHover={{ 
              borderColor: '#2a2a2d',
              color: '#c4c4c6'
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <motion.span
              className="relative z-10"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Start check-in
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#2d4a3a]/0 via-[#2d4a3a]/20 to-[#2d4a3a]/0"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>

        <motion.div 
          className="border border-[#1a1a1d] bg-[#0a0a0b] p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[#0e0e10] border border-[#1a1a1d]">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-[#ff6b4a]" />
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#4a4a4d]">Streak</p>
              </div>
              <motion.p 
                className="text-3xl text-[#c4c4c6] font-light"
                key={metrics.currentStreak}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {metrics.currentStreak}
              </motion.p>
              <p className="text-xs text-[#6a6a6d] mt-1">days</p>
            </div>
            <div className="p-4 bg-[#0e0e10] border border-[#1a1a1d]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-[#3dd98f]" />
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#4a4a4d]">Points</p>
              </div>
              <motion.p 
                className="text-3xl text-[#c4c4c6] font-light"
                key={metrics.yourPoints}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {metrics.yourPoints}
              </motion.p>
              {metrics.lastPoints && (
                <p className="text-xs text-[#6a6a6d] mt-1">+{metrics.lastPoints.points} last</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#4a4a4d]" />
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#4a4a4d]">Leaderboard</p>
            </div>
            <div className="space-y-2">
              {metrics.leaderboard.slice(0, 5).map((entry, idx) => (
                <motion.div 
                  key={entry.user} 
                  className="flex items-center justify-between text-sm text-[#c4c4c6] p-2 bg-[#0e0e10] border border-[#1a1a1d]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ${
                      idx === 0 ? 'bg-[#3dd98f] text-black' : 
                      idx === 1 ? 'bg-[#6a6a6d] text-black' : 
                      idx === 2 ? 'bg-[#8a6040] text-black' : 
                      'bg-[#1a1a1d] text-[#4a4a4d]'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={entry.user === metrics.user ? 'text-[#3dd98f] font-semibold' : 'text-[#8a8a8d]'}>
                      {entry.user}{entry.user === metrics.user ? ' (You)' : ''}
                    </span>
                  </div>
                  <span className="text-[#8a8a8d]">{entry.points}</span>
                </motion.div>
              ))}
              {metrics.leaderboard.length === 0 && (
                <p className="text-xs text-[#4a4a4d] p-2">No scores yet. Complete a day to enter the board.</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Link to={createPageUrl('Analytics')} className="border border-[#1a1a1d] bg-[#0a0a0b] p-4 hover:border-[#2a2a2d] transition-all duration-300 block hover:shadow-lg hover:shadow-[#2d4a3a]/20 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    whileHover={{ x: 2 }}
                  >
                    <Target className="w-4 h-4 text-[#4a4a4d] group-hover:text-[#3dd98f] transition-colors" />
                    <p className="text-xs uppercase tracking-[0.15em] text-[#4a4a4d] group-hover:text-[#8a8a8d] transition-colors">
                      Analytics
                    </p>
                  </motion.div>
                  <p className="text-sm text-[#c4c4c6] group-hover:text-white transition-colors">
                    Performance insights
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-[#1a1a1d] group-hover:text-[#3dd98f] transition-colors" />
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to={createPageUrl('Status')} className="border border-[#1a1a1d] bg-[#0a0a0b] p-4 hover:border-[#2a2a2d] transition-all duration-300 block hover:shadow-lg hover:shadow-[#2d4a3a]/20 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    whileHover={{ x: 2 }}
                  >
                    <Calendar className="w-4 h-4 text-[#4a4a4d] group-hover:text-[#3dd98f] transition-colors" />
                    <p className="text-xs uppercase tracking-[0.15em] text-[#4a4a4d] group-hover:text-[#8a8a8d] transition-colors">
                      View more
                    </p>
                  </motion.div>
                  <p className="text-sm text-[#c4c4c6] group-hover:text-white transition-colors">
                    Status & history
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#1a1a1d] group-hover:text-[#3dd98f] transition-colors" />
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Link to={createPageUrl('Settings')} className="border border-[#1a1a1d] bg-[#0a0a0b] p-4 hover:border-[#2a2a2d] transition-all duration-300 block hover:shadow-lg hover:shadow-[#2d4a3a]/20 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    whileHover={{ x: 2 }}
                  >
                    <AlertCircle className="w-4 h-4 text-[#4a4a4d] group-hover:text-[#3dd98f] transition-colors" />
                    <p className="text-xs uppercase tracking-[0.15em] text-[#4a4a4d] group-hover:text-[#8a8a8d] transition-colors">
                      Manage
                    </p>
                  </motion.div>
                  <p className="text-sm text-[#c4c4c6] group-hover:text-white transition-colors">
                    Settings
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

type SummaryResult = {
  range: string;
  daysEvaluated: number;
  totalScore: number;
  averageScore: number;
  perDay: Array<{ date: string; score: number }>;
  paywallReason?: { code: string; feature: string } | null;
};

function DashboardV2() {
  const { isPremium, paywallHint, pledgeAcceptedAt, refetch } = useMizanSession();
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pledgeSaving, setPledgeSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingSummary(true);
    getSummary('14d')
      .then((data) => {
        if (!mounted) return;
        setSummary(data);
        setError(null);
      })
      .catch(() => {
        if (!mounted) return;
        setError('Summary unavailable');
      })
      .finally(() => {
        if (mounted) setLoadingSummary(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const lockedCopy = paywallHint?.feature ? `Full consequence locked (${paywallHint.feature})` : 'Full consequence locked';
  const visibleAverage = isPremium ? summary?.averageScore : summary ? Math.max(0, Math.round(summary.averageScore * 0.4)) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#c4c4c6] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#4a4a4d] mb-2">Ledger</p>
          <h1 className="text-3xl font-light">Summary</h1>
        </div>

        <div className="border border-[#1a1a1d] bg-[#0e0e10] p-6 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#6a6a6d]">Past 14 days</p>
              <p className="text-4xl font-light text-white mt-1">{visibleAverage ?? '—'}</p>
              <p className="text-xs text-[#6a6a6d] mt-1">Average score</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6a6a6d]">Days logged</p>
              <p className="text-xl text-white">{summary?.daysEvaluated ?? '—'}</p>
            </div>
          </div>

          {!isPremium && (
            <div className="absolute inset-0 bg-[#0a0a0b]/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center px-6">
                <Lock className="w-10 h-10 text-[#3dd98f] mx-auto mb-3" />
                <p className="text-base font-semibold mb-1">{lockedCopy}</p>
                <p className="text-sm text-[#8a8a8d] mb-4">Ledger consequences stay sealed until you upgrade.</p>
                <button
                  onClick={() => setShowLockedModal(true)}
                  className="px-4 py-2 bg-[#2d4a3a] hover:bg-[#3d5a4a] text-[#0a0a0a] font-semibold text-sm tracking-wide transition-colors"
                >
                  View why
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#1a1a1d] bg-[#0a0a0b]">
              <p className="text-xs uppercase tracking-[0.12em] text-[#4a4a4d] mb-2">Total</p>
              <p className="text-2xl text-white">{summary?.totalScore ?? '—'}</p>
              <p className="text-xs text-[#6a6a6d] mt-1">Accumulated score</p>
            </div>
            <div className="p-4 border border-[#1a1a1d] bg-[#0a0a0b]">
              <p className="text-xs uppercase tracking-[0.12em] text-[#4a4a4d] mb-2">Last logged day</p>
              <p className="text-2xl text-white">{summary?.perDay?.slice(-1)[0]?.date ?? '—'}</p>
              <p className="text-xs text-[#6a6a6d] mt-1">Shows only the date, not the contents</p>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
          {loadingSummary && <p className="text-xs text-[#6a6a6d] mt-3">Loading summary…</p>}
        </div>

        {isPremium && !pledgeAcceptedAt && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#0a0a0b] border border-[#1a1a1d] p-6 max-w-sm w-full text-left">
              <p className="text-lg font-semibold text-white mb-3">This is a commitment.</p>
              <div className="space-y-3 text-sm text-[#c4c4c6]">
                <label className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1" defaultChecked />
                  <span>I accept the record will stay.</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1" defaultChecked />
                  <span>I accept sealed days cannot be edited.</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1" defaultChecked />
                  <span>I accept consequences for missed duties.</span>
                </label>
              </div>
              <button
                onClick={async () => {
                  setPledgeSaving(true);
                  try {
                    await (await import('@/utils/api')).acceptPledge();
                    await refetch();
                  } finally {
                    setPledgeSaving(false);
                  }
                }}
                className="w-full mt-4 px-4 py-2 bg-[#2d4a3a] text-[#0a0a0a] font-semibold text-sm tracking-wide disabled:bg-[#1a1a1d] disabled:text-[#4a4a4d]"
                disabled={pledgeSaving}
              >
                {pledgeSaving ? 'Saving…' : 'I accept'}
              </button>
            </div>
          </div>
        )}

        {showLockedModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0a0a0b] border border-[#1a1a1d] p-6 max-w-sm w-full text-left">
              <p className="text-lg font-semibold text-white mb-2">Access required</p>
              <p className="text-sm text-[#c4c4c6] mb-4">
                {paywallHint?.code === 'premium_required'
                  ? 'Your ledger is sealed until premium is active. No previews, no exceptions.'
                  : 'Upgrade to unlock full consequence view and sealed ledger summaries.'}
              </p>
              <button
                onClick={() => setShowLockedModal(false)}
                className="w-full px-4 py-2 bg-[#2d4a3a] hover:bg-[#3d5a4a] text-[#0a0a0a] font-semibold text-sm tracking-wide"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { featureFlags, isLoading } = useMizanSession();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-[#c4c4c6] px-6 py-12 flex items-center justify-center">
        <p className="text-sm text-[#6a6a6d]">Loading ledger…</p>
      </div>
    );
  }

  if (!featureFlags?.premiumV2) {
    return <LegacyDashboard />;
  }

  return <DashboardV2 />;
}
