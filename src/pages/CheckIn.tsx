import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Building2, Book, Dumbbell, Hammer, BookOpen, BarChart3, Target, Lock } from 'lucide-react';
import { CategoryItem, SubCheckbox } from '@/components/CategoryItem';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ChecklistItem } from '@/components/ChecklistItem';
import { CircleProgress } from '@/components/CircleProgress';
import { createPageUrl } from '@/utils/urls';
import { useCheckin } from '@/hooks/useCheckin';
import { SalahPrayer } from '@/utils/storage';

export default function CheckIn() {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Salah']));

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const {
    dayKey,
    categories,
    penalties,
    penaltiesResolved,
    canSubmit,
    submitted,
    toggleSalahPrayer,
    toggleQuranOption,
    setQuranDuration,
    togglePhysicalOption,
    setPhysicalDuration,
    toggleBuildOption,
    setBuildDescription,
    toggleOptionalTask,
    togglePenalty,
    submit,
    salahComplete,
    salahLateCount,
    quranComplete,
    physicalComplete,
    buildComplete,
    otherCategoriesCompleted
  } = useCheckin();

  const prayers: SalahPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const prayerLabels: Record<SalahPrayer, string> = {
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha'
  };

  return (
    <div className="min-h-screen bg-[#050506] px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-10 flex items-center justify-end">
          <div className="flex items-center gap-3 text-[#4a4a4d] text-xs tracking-[0.18em] uppercase">
            <CheckCircle2 className="w-4 h-4 text-[#2d4a3a]" />
            <span>Salah {salahComplete ? '✓' : `(${salahLateCount} late)`} + {otherCategoriesCompleted}/2 categories</span>
            {submitted && <Lock className="w-4 h-4 text-[#6a6a6d]" title="Ledger sealed" />}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-10 p-6 border border-[#141417] bg-gradient-to-br from-[#0b0c0e] to-[#0a0d0b]">
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="w-1 h-8 bg-gradient-to-b from-[#2d4a3a] to-transparent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex-1">
              <p className="text-[#3a3a3d] text-xs tracking-[0.18em] uppercase">{dayKey}</p>
              <p className="text-[#c4c4c6] text-xl tracking-wide">Daily Mīzān</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <CircleProgress 
                value={otherCategoriesCompleted + (salahComplete ? 1 : 0)}
                max={7}
                size={100}
                color="#3dd98f"
              />
            </motion.div>
          </div>
          <p className="text-[#4a4a4d] text-xs tracking-wide">
            Salah is required. Complete at least 2 additional categories.
          </p>
        </motion.div>

        <div className="space-y-3 mb-6">
          {/* Salah - Always expanded, with smooth animations */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="cursor-pointer"
          >
            <CategoryItem
              title="Salah"
              description="Five daily prayers"
              completed={salahComplete}
              required
              disabled={submitted}
              expanded={expandedCategories.has('Salah')}
              onHeaderClick={() => toggleCategory('Salah')}
              icon={<Building2 className="w-5 h-5 text-blue-500" />}
              iconColor="bg-blue-500/10"
            >
              <div className="space-y-3">
                {prayers.map((prayer, idx) => (
                  <motion.div 
                    key={prayer} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <p className="text-[#5a5a5d] text-sm w-20 capitalize">{prayerLabels[prayer]}</p>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSalahPrayer(prayer, categories.salah[prayer] === 'ontime' ? null : 'ontime');
                      }}
                      className={`px-3 py-1 text-xs border ${
                        categories.salah[prayer] === 'ontime'
                          ? 'border-[#2d4a3a] text-[#4a7a5a] bg-[#1a2f23]'
                          : 'border-[#2a2a2d] text-[#4a4a4d]'
                      } transition-all duration-200`}
                      disabled={submitted}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      On time
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSalahPrayer(prayer, categories.salah[prayer] === 'late' ? null : 'late');
                      }}
                      className={`px-3 py-1 text-xs border ${
                        categories.salah[prayer] === 'late'
                          ? 'border-[#b45c3c] text-[#b45c3c] bg-[#2a1a1a]'
                          : 'border-[#2a2a2d] text-[#4a4a4d]'
                      } transition-all duration-200`}
                      disabled={submitted}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Late
                    </motion.button>
                  </motion.div>
                ))}
                {salahLateCount >= 2 && (
                  <motion.p 
                    className="text-[#b45c3c] text-xs mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    2+ late prayers = partial completion
                  </motion.p>
                )}
              </div>
            </CategoryItem>
          </motion.div>

          {/* Qur'an - Collapsible */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cursor-pointer"
          >
            <CategoryItem
              title="Qur'an"
              description="Recitation, reading, or reflection"
              completed={quranComplete}
              disabled={submitted}
              expanded={expandedCategories.has('Quran')}
              onHeaderClick={() => toggleCategory('Quran')}
              icon={<Book className="w-5 h-5 text-purple-500" />}
              iconColor="bg-purple-500/10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <SubCheckbox
                  label="Recitation"
                  checked={categories.quran.selected.includes('recitation')}
                  onToggle={() => toggleQuranOption('recitation')}
                  disabled={submitted}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <SubCheckbox
                  label="Reading with meaning"
                  checked={categories.quran.selected.includes('reading')}
                  onToggle={() => toggleQuranOption('reading')}
                  disabled={submitted}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <SubCheckbox
                  label="Reflection (1 written thought)"
                  checked={categories.quran.selected.includes('reflection')}
                  onToggle={() => toggleQuranOption('reflection')}
                  disabled={submitted}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3">
                <label className="text-[#4a4a4d] text-xs block mb-2">Duration (min, required 10+)</label>
                <input
                  type="number"
                  min="0"
                  value={categories.quran.duration ?? ''}
                  onChange={(e) => setQuranDuration(Number(e.target.value))}
                  placeholder="0"
                  disabled={submitted}
                  className="w-20 bg-[#0e0e10] border border-[#1a1a1d] text-[#c4c4c6] px-3 py-2 text-sm outline-none focus:border-[#2d4a3a] transition-colors"
                />
              </motion.div>
            </CategoryItem>
          </motion.div>

          {/* Physical - Collapsible */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="cursor-pointer"
          >
            <CategoryItem
              title="Physical"
              description="Movement, strength, or recovery"
              completed={physicalComplete}
              disabled={submitted}
              icon={<Dumbbell className="w-5 h-5 text-orange-500" />}
              iconColor="bg-orange-500/10"
              expanded={expandedCategories.has('Physical')}
              onHeaderClick={() => toggleCategory('Physical')}
            >
              <div className="space-y-3">
                {['Strength training', 'Cardio', 'Long walk / movement', 'Mobility / recovery'].map((label, idx) => {
                  const key = label.toLowerCase().replace(/[^\w]/g, '');
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <SubCheckbox
                        label={label}
                        checked={categories.physical.selected.includes(key as any)}
                        onToggle={() => togglePhysicalOption(key as any)}
                        disabled={submitted}
                      />
                    </motion.div>
                  );
                })}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-3">
                  <label className="text-[#4a4a4d] text-xs block mb-2">Duration (min, required 20+)</label>
                  <input
                    type="number"
                    min="0"
                    value={categories.physical.duration ?? ''}
                    onChange={(e) => setPhysicalDuration(Number(e.target.value))}
                    placeholder="0"
                    disabled={submitted}
                    className="w-20 bg-[#0e0e10] border border-[#1a1a1d] text-[#c4c4c6] px-3 py-2 text-sm outline-none focus:border-[#2d4a3a] transition-colors"
                  />
                </motion.div>
              </div>
            </CategoryItem>
          </motion.div>

          {/* Build - Collapsible */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cursor-pointer"
          >
            <CategoryItem
              title="Build"
              description="Tangible output"
              completed={buildComplete}
              disabled={submitted}
              expanded={expandedCategories.has('Build')}
              onHeaderClick={() => toggleCategory('Build')}
              icon={<Hammer className="w-5 h-5 text-yellow-500" />}
              iconColor="bg-yellow-500/10"
            >
              <div className="space-y-3">
                {['Work session completed', 'Studied a skill', 'Produced something'].map((label, idx) => {
                  const key = label.toLowerCase().replace(/[^\w]/g, '');
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <SubCheckbox
                        label={label}
                        checked={categories.build.selected.includes(key as any)}
                        onToggle={() => toggleBuildOption(key as any)}
                        disabled={submitted}
                      />
                    </motion.div>
                  );
                })}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3">
                  <label className="text-[#4a4a4d] text-xs block mb-2">What did you build? (required)</label>
                  <input
                    type="text"
                    value={categories.build.description ?? ''}
                    onChange={(e) => setBuildDescription(e.target.value)}
                    placeholder="One line describing output"
                    disabled={submitted}
                    className="w-full bg-[#0e0e10] border border-[#1a1a1d] text-[#c4c4c6] px-3 py-2 text-sm outline-none focus:border-[#2d4a3a] transition-colors placeholder:text-[#3a3a3d]"
                  />
                </motion.div>
              </div>
            </CategoryItem>
          </motion.div>

          {/* Optional Categories */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <CategoryItem
              title="Study"
              description="Optional: Learning or reading 20+ min"
              completed={categories.study.completed}
              disabled={submitted}
              expanded={expandedCategories.has('Study')}
              onHeaderClick={() => {
                toggleOptionalTask('study');
                toggleCategory('Study');
              }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <CategoryItem
              title="Journal"
              description="Optional: Reflection and planning"
              completed={categories.journal.completed}
              disabled={submitted}
              expanded={expandedCategories.has('Journal')}
              onHeaderClick={() => {
                toggleOptionalTask('journal');
                toggleCategory('Journal');
              }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <CategoryItem
              title="Rest"
              description="Optional: Sleep discipline"
              completed={categories.rest.completed}
              disabled={submitted}
              onHeaderClick={() => toggleOptionalTask('rest')}
            />
          </motion.div>
        </div>

        {penalties.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 border border-[#1a1a1d] bg-[#0b0b0d] mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-4 h-4 text-[#b45c3c]" />
              <div>
                <p className="text-[#c4c4c6] text-sm tracking-wide">Missed Obligations</p>
                <p className="text-[#4a4a4d] text-xs">Clear debts before submitting.</p>
              </div>
            </div>
            <div className="space-y-3">
              {penalties.map((penalty, idx) => (
                <ChecklistItem
                  key={penalty.id}
                  label={penalty.label}
                  description={`From ${penalty.origin}`}
                  checked={penalty.resolved}
                  onToggle={() => togglePenalty(penalty.id)}
                  delay={0.05 * idx}
                  disabled={submitted}
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}>
          <PrimaryButton onClick={submit} disabled={!canSubmit}>
            {submitted
              ? 'Logged'
              : canSubmit
              ? 'Complete today'
              : !salahComplete
              ? 'Complete tasks'
              : otherCategoriesCompleted < 2
              ? `Complete ${2 - otherCategoriesCompleted} more ${otherCategoriesCompleted === 1 ? 'category' : 'categories'}`
              : 'Clear debts first'}
          </PrimaryButton>
          {submitted && (
            <motion.p 
              className="text-[#4a4a4d] text-xs tracking-wide mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Day logged. Return tomorrow for a fresh balance.
            </motion.p>
          )}
        </motion.div>

        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-[#3a3a3d] tracking-wide">
          <Link to={createPageUrl('Status')} className="hover:text-[#6a6a6d] transition-colors duration-200">
            Status
          </Link>
          <span className="w-1 h-1 bg-[#2a2a2d] rounded-full" />
          <Link to={createPageUrl('Settings')} className="hover:text-[#6a6a6d] transition-colors duration-200">
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
