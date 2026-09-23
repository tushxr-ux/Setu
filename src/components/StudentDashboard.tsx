import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Github, ExternalLink, ArrowDownRight, CheckCircle2, Clock, XCircle, Star } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, submissions, withdrawWallet, setActiveTab, challenges } = useApp();
  const [withdrawAmount, setWithdrawAmount] = useState(5000);
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const mySubmissions = submissions.filter(s => s.leadStudentId === currentUser.id);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = withdrawWallet(withdrawAmount, upiId);
    if (ok) setIsWithdrawOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Profile + Wallet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Profile */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <img src={currentUser.avatar} alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-200 shadow-sm" />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h1>
                  <span className="badge badge-blue">Verified</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  {currentUser.college} • Class of {currentUser.graduationYear} •{' '}
                  <span className="text-blue-700 font-bold">★ {currentUser.rating} Rating</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentUser.badges?.map(badge => (
                    <span key={badge} className="badge badge-sky">🏆 {badge}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentUser.githubUrl && (
                <a href={currentUser.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-xs">
                  <Github className="w-3.5 h-3.5" /><span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.skills?.map(skill => (
                <span key={skill} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-semibold">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-blue-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-200 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Wallet className="w-4 h-4 text-sky-300" />
                <span>Solver Wallet</span>
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold">Instant UPI</span>
            </div>
            <div className="text-3xl font-black mt-3 font-mono">
              ₹{(currentUser.walletBalance || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-sky-100 mt-1">
              Total earned: <span className="text-white font-bold">₹{(currentUser.totalEarned || 0).toLocaleString('en-IN')}</span> across {currentUser.solvedCount} challenges
            </p>
          </div>
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="mt-6 w-full py-3 bg-white text-blue-900 font-bold text-sm rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-sm flex items-center justify-center space-x-2"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Withdraw to UPI / Bank</span>
          </button>
        </div>

      </div>

      {/* My Solutions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">My Submissions</h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">Track reviews, payouts, and feedback for each solution submitted.</p>
          </div>
          <button onClick={() => setActiveTab('explore')} className="btn-secondary text-xs">
            Browse Challenges <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {mySubmissions.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">No solutions submitted yet.</p>
            <button onClick={() => setActiveTab('explore')} className="mt-3 btn-primary text-sm">Browse Open Challenges</button>
          </div>
        ) : (
          <div className="space-y-3">
            {mySubmissions.map(sub => {
              const ch = challenges.find(c => c.id === sub.challengeId);
              const winnerPayout = ch ? Math.round(ch.rewardAmount * 0.7) : 0;
              return (
                <div key={sub.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="badge badge-blue font-mono font-bold">₹{winnerPayout.toLocaleString('en-IN')} winner</span>
                      <span className="text-xs text-slate-600 font-medium">{new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{sub.challengeTitle}</h3>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">Team: {sub.teamName} • {sub.memberCount} member{sub.memberCount > 1 ? 's' : ''}</div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-600 font-bold uppercase">Originality</div>
                      <div className={`text-xs font-mono font-bold ${sub.plagiarismFlagged ? 'text-red-600' : 'text-green-600'}`}>
                        {sub.plagiarismScore}%
                      </div>
                    </div>
                    <span className={`badge ${
                      sub.status === 'Accepted' ? 'badge-green' :
                      sub.status === 'Rejected' ? 'badge-red' :
                      sub.status === 'Disputed' ? 'badge-purple' :
                      'badge-amber'
                    }`}>{sub.status}</span>
                    {sub.feedback && (
                      <div className="max-w-xs text-xs text-slate-700 italic hidden lg:block line-clamp-2">
                        "{sub.feedback}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700"><Wallet className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-slate-900">Withdraw Earnings</h3>
                <p className="text-xs text-slate-600 font-medium">Instant transfer via NPCI UPI / IMPS</p>
              </div>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                  <span>Amount (₹)</span>
                  <span>Available: ₹{(currentUser.walletBalance || 0).toLocaleString('en-IN')}</span>
                </div>
                <input type="number" min={100} max={currentUser.walletBalance || 0} required
                  value={withdrawAmount} onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="form-input font-mono font-bold text-blue-700" />
              </div>
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1">UPI ID / Account Number</label>
                <input value={upiId} onChange={e => setUpiId(e.target.value)} required className="form-input font-mono text-sm" placeholder="name@upi" />
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-medium">
                ✓ 0% withdrawal fee • Instant NPCI settlement within 15 minutes
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button type="button" onClick={() => setIsWithdrawOpen(false)} className="btn-ghost text-xs">Cancel</button>
                <button type="submit" className="btn-primary text-xs">Confirm Withdrawal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
