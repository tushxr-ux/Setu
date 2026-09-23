import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Challenge } from '../types';
import { X, Lock, Plus, Trash2, Info, ShieldCheck } from 'lucide-react';

export const PostChallengeModal: React.FC = () => {
  const { isPostModalOpen, setIsPostModalOpen, postChallenge, role } = useApp();

  const [track, setTrack] = useState<'Public' | 'Private'>(role === 'government' ? 'Public' : 'Private');
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState<Challenge['sector']>('Infrastructure');
  const [difficulty, setDifficulty] = useState<Challenge['difficulty']>('Intermediate');
  const [rewardAmount, setRewardAmount] = useState(25000);
  const [rewardType, setRewardType] = useState<'cash' | 'certificate' | 'hybrid'>(role === 'government' ? 'hybrid' : 'cash');
  const [requiresDevType, setRequiresDevType] = useState<'web' | 'mobile' | 'iot' | 'any'>('any');
  const [tagsInput, setTagsInput] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [locationScope, setLocationScope] = useState<'National' | 'State'>('National');
  const [locationState, setLocationState] = useState('Jharkhand');
  const [criteria, setCriteria] = useState<string[]>(['Solution must work on entry-level Android devices']);
  const [newCriterion, setNewCriterion] = useState('');
  const [maxTeams, setMaxTeams] = useState(12);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPostModalOpen) return null;

  const platformFee = track === 'Private' ? Math.round(rewardAmount * 0.07) : 0;
  const winnerPayout = Math.round(rewardAmount * 0.7) - platformFee;
  const othersPayout = Math.round(rewardAmount * 0.3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setIsSubmitting(true);
    setTimeout(() => {
      postChallenge({
        track, title, description, problemStatement, expectedOutcome,
        sector, difficulty, rewardAmount, rewardType, requiresDevType,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        locationScope,
        locationState: locationScope === 'State' ? locationState : undefined,
        acceptanceCriteria: criteria,
        maxTeams,
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsPostModalOpen(false)}>
      <div className="modal-panel max-w-3xl w-full my-6" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Post a Challenge</h2>
            <p className="text-xs text-slate-500 mt-0.5">Reward is escrowed before any team starts — guaranteed payout on acceptance.</p>
          </div>
          <button onClick={() => setIsPostModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Track toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Challenge Track</label>
            <div className="flex gap-3">
              {(['Public', 'Private'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrack(t)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    track === t
                      ? t === 'Public' ? 'border-blue-700 bg-blue-50 text-blue-800' : 'border-indigo-600 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {t === 'Public' ? '🏛 Government / NGO (Free listing)' : '🏢 Private Sector (7% success fee)'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Challenge Title *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. AI-Powered Crop Disease Detection via WhatsApp for Rural Farmers"
              className="form-input" />
          </div>

          {/* Row: Sector / Difficulty / Dev Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Sector</label>
              <select value={sector} onChange={e => setSector(e.target.value as Challenge['sector'])} className="form-select">
                {['Water & Sanitation', 'Healthcare', 'Agriculture', 'Education', 'Infrastructure', 'Environment', 'Fintech', 'Governance', 'Smart Cities', 'Other'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value as Challenge['difficulty'])} className="form-select">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Solution Type</label>
              <select value={requiresDevType} onChange={e => setRequiresDevType(e.target.value as any)} className="form-select">
                <option value="any">Any</option>
                <option value="web">Web App</option>
                <option value="mobile">Mobile App</option>
                <option value="iot">IoT / Hardware</option>
              </select>
            </div>
          </div>

          {/* Row: Reward / Type / Max Teams */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Reward (₹ INR)</label>
              <input type="number" min={5000} step={1000} required value={rewardAmount}
                onChange={e => setRewardAmount(Number(e.target.value))}
                className="form-input font-mono font-bold text-blue-700" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Reward Type</label>
              <select value={rewardType} onChange={e => setRewardType(e.target.value as any)} className="form-select">
                <option value="cash">Cash</option>
                <option value="certificate">Certificate + Recognition</option>
                <option value="hybrid">Hybrid (Cash + Certificate)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Max Teams</label>
              <input type="number" min={2} max={50} value={maxTeams}
                onChange={e => setMaxTeams(Number(e.target.value))}
                className="form-input" />
            </div>
          </div>

          {/* Escrow Preview */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
            <div className="font-bold text-blue-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Escrow Preview — Automatic 70/30 fairness split</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 font-mono">
              <div className="p-2 bg-white rounded-lg border border-blue-100 text-center">
                <div className="font-bold text-blue-800">₹{rewardAmount.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500">Total Locked</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100 text-center">
                <div className="font-bold text-blue-700">₹{winnerPayout.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500">Winner Payout</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100 text-center">
                <div className="font-bold text-slate-700">₹{othersPayout.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500">Other Finishers</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100 text-center">
                <div className="font-bold text-slate-500">₹{platformFee.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500">Platform Fee</div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Location Scope</label>
              <select value={locationScope} onChange={e => setLocationScope(e.target.value as any)} className="form-select">
                <option value="National">🌐 National</option>
                <option value="State">📍 State-specific</option>
              </select>
            </div>
            {locationScope === 'State' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">State</label>
                <input value={locationState} onChange={e => setLocationState(e.target.value)} className="form-input" placeholder="e.g. Jharkhand" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tech Stack Tags</label>
            <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              placeholder="React Native, TensorFlow Lite, GPS, Offline First" className="form-input" />
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Problem Background (optional)</label>
            <textarea rows={2} value={problemStatement} onChange={e => setProblemStatement(e.target.value)}
              placeholder="Briefly explain why this problem exists and its impact..."
              className="form-textarea" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Challenge Description *</label>
            <textarea rows={4} required value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the challenge in detail — current situation, what to build, constraints..."
              className="form-textarea" />
          </div>

          {/* Expected Outcome */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Expected Impact / Outcome</label>
            <input value={expectedOutcome} onChange={e => setExpectedOutcome(e.target.value)}
              placeholder="e.g. Reduce pothole response time from 3 weeks to 5 days"
              className="form-input" />
          </div>

          {/* Acceptance Criteria */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Acceptance Criteria</label>
            <div className="space-y-2 mb-2">
              {criteria.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span>{idx + 1}. {c}</span>
                  <button type="button" onClick={() => setCriteria(criteria.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCriterion} onChange={e => setNewCriterion(e.target.value)}
                placeholder="Add a specific, measurable criterion..."
                className="form-input flex-1 text-xs" />
              <button type="button" onClick={() => { if (newCriterion.trim()) { setCriteria([...criteria, newCriterion.trim()]); setNewCriterion(''); } }}
                className="btn-secondary text-xs px-3 py-2">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={() => setIsPostModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="btn-primary text-sm disabled:opacity-50">
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Funding Escrow...' : `Fund Escrow & Post (₹${rewardAmount.toLocaleString('en-IN')})`}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
