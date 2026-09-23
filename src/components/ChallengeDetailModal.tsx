import React, { useState } from 'react';
import { Challenge } from '../types';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, CheckCircle, Clock, Copy, Check, Users, ExternalLink, AlertCircle, Landmark, Building2 } from 'lucide-react';

interface ChallengeDetailModalProps {
  challenge: Challenge;
  onClose: () => void;
  onOpenSubmit: () => void;
}

export const ChallengeDetailModal: React.FC<ChallengeDetailModalProps> = ({ challenge: ch, onClose, onOpenSubmit }) => {
  const { role, submissions, setActiveTab } = useApp();
  const [copied, setCopied] = useState(false);

  const chSubmissions = submissions.filter(s => s.challengeId === ch.id);
  const platformFee = ch.track === 'Private' ? Math.round(ch.rewardAmount * 0.07) : 0;
  const winnerPayout = Math.round(ch.rewardAmount * 0.7) - platformFee;
  const othersPayout = Math.round(ch.rewardAmount * 0.3);

  const daysLeft = Math.ceil((new Date(ch.deadline).getTime() - Date.now()) / 86400000);

  const PosterIcon = ch.posterType === 'government' ? Landmark : Building2;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel max-w-4xl w-full my-6" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
              <img src={ch.posterLogo} alt={ch.posterName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <PosterIcon className="w-3.5 h-3.5" />
                  <span>{ch.posterName}</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  ch.track === 'Public' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {ch.track === 'Public' ? '🏛 Government / NGO' : '🏢 Private Sector'}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{ch.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">

          {/* Escrow & Reward Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-white/15">
                <ShieldCheck className="w-6 h-6 text-sky-200" />
              </div>
              <div>
                <div className="font-bold text-sky-100 text-sm">Escrow-Backed Reward — Verified Funded</div>
                <div className="text-xs text-blue-200 mt-0.5 font-mono">{ch.escrowTxnId}</div>
                <div className="text-xs text-blue-200 mt-1">
                  Reward is locked before any team starts. Released automatically upon acceptance.
                </div>
              </div>
            </div>

            <div className="text-right border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-5 pt-3 sm:pt-0">
              <div className="text-3xl font-black font-mono text-white">
                ₹{ch.rewardAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-blue-200 mt-1 space-y-0.5">
                <div>Winner (70%): <span className="text-white font-bold">₹{winnerPayout.toLocaleString('en-IN')}</span></div>
                <div>Other finishers (30%): <span className="text-white font-bold">₹{othersPayout.toLocaleString('en-IN')}</span></div>
                {ch.track === 'Private' && <div>Platform fee (7%): ₹{platformFee.toLocaleString('en-IN')}</div>}
              </div>
            </div>
          </div>

          {/* Fairness Notice for Private */}
          {ch.track === 'Private' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="font-bold text-amber-900 flex items-center space-x-1.5"><AlertCircle className="w-4 h-4" /><span>Private-Sector Fairness Safeguards (Setu Rules)</span></div>
              <ul className="list-disc pl-5 space-y-0.5 text-amber-700">
                <li>Only the winning team's IP transfers to the company — every other team retains full ownership.</li>
                <li>Every team that submits a complete judged solution earns a guaranteed share of the reward pool (30% split).</li>
                <li>Scope is capped to a bounded prototype — no attempt to get a full production product built for free.</li>
              </ul>
            </div>
          )}

          {/* Problem Statement */}
          {ch.problemStatement && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Problem Background</h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                {ch.problemStatement}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Challenge Brief</h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {ch.description}
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Acceptance Criteria</span>
            </h3>
            <ul className="space-y-2">
              {ch.acceptanceCriteria.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expected Outcome */}
          {ch.expectedOutcome && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Expected Impact</h3>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
                🎯 {ch.expectedOutcome}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="font-semibold">Location Scope:</span>
            <span className={`font-bold ${ch.locationScope === 'National' ? 'text-blue-700' : 'text-slate-700'}`}>
              {ch.locationScope === 'National' ? '🌐 National (Open to All India)' : `📍 ${ch.locationState} Only`}
            </span>
          </div>

          {/* Submissions */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Submissions ({chSubmissions.length})
              </h3>
              {(role === 'company' || role === 'government') && (
                <button onClick={() => { onClose(); setActiveTab('org-dashboard'); }} className="text-xs text-blue-600 hover:underline flex items-center space-x-1">
                  <span>Review Inbox</span><ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
            {chSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 rounded-xl">
                No solutions submitted yet. Be the first team to claim this challenge!
              </p>
            ) : (
              <div className="space-y-2">
                {chSubmissions.map(sub => (
                  <div key={sub.id} className="p-3 rounded-xl border border-slate-100 bg-white flex items-center justify-between text-xs shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <img src={sub.leadStudentAvatar} alt={sub.leadStudentName} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-800">{sub.teamName}</div>
                        <div className="text-slate-400">{sub.leadStudentName} • {sub.leadStudentCollege}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        sub.status === 'Accepted' ? 'bg-green-50 text-green-700 border border-green-200' :
                        sub.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>{sub.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button onClick={onClose} className="btn-ghost text-sm">Close</button>
          {ch.status === 'Open' && role === 'student' ? (
            <button
              onClick={() => { onClose(); onOpenSubmit(); }}
              className="btn-primary text-sm"
            >
              <span>Apply to Solve — ₹{winnerPayout.toLocaleString('en-IN')} winner payout</span>
            </button>
          ) : ch.status !== 'Open' ? (
            <span className="text-xs text-slate-400 font-mono">Challenge {ch.status}</span>
          ) : (
            <span className="text-xs text-slate-400">Log in as Student to apply</span>
          )}
        </div>

      </div>
    </div>
  );
};
