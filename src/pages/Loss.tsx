import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { useMizanSession } from '@/contexts/MizanSessionContext';
import { getLoss } from '@/utils/api';

interface LossDetail {
  date: string;
  score: number;
  deficit: number;
  sealed: boolean;
}

interface LossResponse {
  window: string;
  daysEvaluated: number;
  sealedEntries: number;
  unsealedEntries: number;
  missingDays: number;
  paywallReason?: { code: string; feature: string } | null;
  totalScore?: number;
  totalDeficit?: number;
  averageScore?: number;
  details?: LossDetail[];
}

export default function Loss() {
  const { isPremium } = useMizanSession();
  const [data, setData] = useState<LossResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getLoss()
      .then((payload) => {
        if (!active) return;
        setData(payload);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError('Loss data unavailable');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const teaserLine = 'Detailed loss record is locked.';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#c4c4c6] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#4a4a4d] mb-2">Loss</p>
          <h1 className="text-3xl font-light">Penalty ledger</h1>
        </div>

        <div className="border border-[#1a1a1d] bg-[#0e0e10] p-5">
          <p className="text-sm text-[#6a6a6d] mb-2">Window: {data?.window ?? '—'}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-[#4a4a4d] uppercase tracking-[0.12em]">Days evaluated</p>
              <p className="text-xl text-white">{data?.daysEvaluated ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#4a4a4d] uppercase tracking-[0.12em]">Sealed entries</p>
              <p className="text-xl text-white">{data?.sealedEntries ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#4a4a4d] uppercase tracking-[0.12em]">Unsealed</p>
              <p className="text-xl text-white">{data?.unsealedEntries ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#4a4a4d] uppercase tracking-[0.12em]">Missing days</p>
              <p className="text-xl text-white">{data?.missingDays ?? '—'}</p>
            </div>
          </div>

          {!isPremium && (
            <div className="mt-6 flex items-center gap-2 text-sm text-[#8a8a8d]">
              <Lock className="w-4 h-4 text-[#6a6a6d]" />
              <span>{teaserLine}</span>
            </div>
          )}

          {isPremium && data?.details && (
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex gap-4 text-[#8a8a8d] text-xs">
                <span>Total score: {data.totalScore ?? '—'}</span>
                <span>Average score: {data.averageScore ?? '—'}</span>
                <span>Deficit: {data.totalDeficit ?? '—'}</span>
              </div>
              <div className="border border-[#1a1a1d] divide-y divide-[#1a1a1d]">
                {data.details.map((d) => (
                  <div key={d.date} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      {d.sealed ? <Lock className="w-4 h-4 text-[#6a6a6d]" /> : <span className="text-[#6a6a6d] text-xs">Open</span>}
                      <span className="text-white text-sm">{d.date}</span>
                    </div>
                    <div className="text-right text-sm text-[#c4c4c6]">
                      <span className="block">Score: {d.score}</span>
                      <span className="block text-[#8a8a8d]">Deficit: {d.deficit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
          {loading && <p className="text-xs text-[#6a6a6d] mt-3">Loading loss…</p>}
        </div>
      </div>
    </div>
  );
}
