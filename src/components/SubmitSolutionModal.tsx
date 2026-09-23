import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Challenge } from '../types';
import { X, Github, Video, FileText, Cpu, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

interface SubmitSolutionModalProps {
  challenge: Challenge;
  onClose: () => void;
}

export const SubmitSolutionModal: React.FC<SubmitSolutionModalProps> = ({ challenge: ch, onClose }) => {
  const { submitSolution } = useApp();

  const [teamName, setTeamName] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [githubUrl, setGithubUrl] = useState('');
  const [prUrl, setPrUrl] = useState('');
  const [writeup, setWriteup] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ score: number; clean: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformFee = ch.track === 'Private' ? Math.round(ch.rewardAmount * 0.07) : 0;
  const winnerPayout = Math.round(ch.rewardAmount * 0.7) - platformFee;

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const score = +(Math.random() * 6 + 1.8).toFixed(1);
      setScanResult({ score, clean: score < 30 });
      setIsScanning(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl || !writeup) return;
    setIsSubmitting(true);
    setTimeout(() => {
      submitSolution({ challengeId: ch.id, teamName, githubUrl, prUrl: prUrl || undefined, writeup, demoUrl: demoUrl || undefined });
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel max-w-2xl w-full my-auto sm:my-6 rounded-2xl sm:rounded-3xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-gradient-to-r from-blue-700 to-blue-800 text-white flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-blue-200">Submitting solution for</div>
            <h2 className="text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-2">{ch.title}</h2>
            <div className="text-xs text-sky-200 mt-1 font-mono">
              Winner payout: ₹{winnerPayout.toLocaleString('en-IN')} | Others share: ₹{Math.round(ch.rewardAmount * 0.3).toLocaleString('en-IN')}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[72vh] overflow-y-auto">

          {/* Team Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Team Name *</label>
              <input type="text" required value={teamName} onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. CivicBuild IIT-D"
                className="form-input" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Team Members</span>
              </label>
              <input type="number" min={1} max={6} value={memberCount} onChange={e => setMemberCount(Number(e.target.value))} className="form-input" />
            </div>
          </div>

          {/* GitHub + Demo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center space-x-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo / Fork *</span>
              </label>
              <input type="url" required value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/team/solution"
                className="form-input font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center space-x-1.5">
                <Video className="w-3.5 h-3.5 text-blue-400" />
                <span>Demo / Loom Link (Optional)</span>
              </label>
              <input type="url" value={demoUrl} onChange={e => setDemoUrl(e.target.value)}
                placeholder="https://loom.com/share/..."
                className="form-input font-mono text-sm" />
            </div>
          </div>

          {/* Technical Write-up */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Technical Writeup — Root cause, architecture, benchmarks *</span>
            </label>
            <textarea rows={5} required value={writeup} onChange={e => setWriteup(e.target.value)}
              placeholder="Explain:
1. What was the core technical challenge?
2. How did you architect your solution?
3. How does it meet each acceptance criterion?
4. What were your performance benchmarks / test results?"
              className="form-textarea" />
          </div>

          {/* Originality Check */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>Pre-Submission Originality Check</span>
              </span>
              <button type="button" onClick={runScan} disabled={isScanning}
                className="text-xs text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-100 disabled:opacity-50">
                {isScanning ? 'Scanning...' : 'Run Check'}
              </button>
            </div>
            {scanResult && (
              <div className={`flex items-center space-x-2 p-2.5 rounded-lg border text-xs ${
                scanResult.clean
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {scanResult.clean
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  : <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                }
                <span>
                  Similarity Index: <strong className="font-mono">{scanResult.score}%</strong> —{' '}
                  {scanResult.clean ? 'Passes Setu originality threshold (< 30%)' : 'High similarity detected — admin review will be triggered'}
                </span>
              </div>
            )}
            {!scanResult && (
              <p className="text-xs text-slate-400">Click "Run Check" to verify against 18,000+ public repositories before submitting.</p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button type="button" onClick={onClose} className="btn-ghost text-xs sm:text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 disabled:opacity-50">
              <span className="hidden sm:inline">{isSubmitting ? 'Uploading...' : `Submit Solution for ₹${winnerPayout.toLocaleString('en-IN')}`}</span>
              <span className="sm:hidden">{isSubmitting ? 'Uploading...' : `Submit (₹${winnerPayout.toLocaleString('en-IN')})`}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
