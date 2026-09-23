import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, Users, TrendingUp, Flag, Scale } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { challenges, submissions, escrowTransactions, disputes, resolveDispute } = useApp();

  const [activeSection, setActiveSection] = useState<'overview' | 'submissions' | 'disputes' | 'escrow'>('overview');
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState<'Resolved - Student Paid' | 'Resolved - Org Refunded'>('Resolved - Student Paid');

  const flagged = submissions.filter(s => s.plagiarismFlagged);
  const pending = submissions.filter(s => s.status === 'Pending Review');
  const totalEscrowed = escrowTransactions.filter(t => t.status === 'Locked in Escrow').reduce((a, t) => a + t.amount, 0);
  const openDisputes = disputes.filter(d => d.status === 'Open' || d.status === 'Under Investigation');

  const tabs = [
    { key: 'overview',     label: 'Overview',     icon: TrendingUp },
    { key: 'submissions',  label: `Flagged (${flagged.length})`, icon: AlertTriangle },
    { key: 'disputes',     label: `Disputes (${openDisputes.length})`, icon: Scale },
    { key: 'escrow',       label: 'Escrow Ledger', icon: ShieldCheck },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Trust & Safety — Admin Portal</h1>
          <p className="text-sm text-slate-600 font-medium mt-0.5">Setu platform moderation and escrow management console.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="badge badge-blue">Admin Access</span>
          <span className="badge badge-green"><span className="pulse-dot mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-green-500" />All Systems Operational</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white border border-slate-200 rounded-2xl p-2 shadow-card">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveSection(key as any)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeSection === key ? 'bg-blue-700 text-white shadow-blue-sm' : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
            }`}>
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total Challenges', value: challenges.length, color: 'text-blue-700', bg: 'bg-blue-50', icon: CheckCircle2 },
              { label: 'Pending Review', value: pending.length, color: 'text-amber-700', bg: 'bg-amber-50', icon: AlertTriangle },
              { label: 'Plagiarism Flags', value: flagged.length, color: 'text-red-700', bg: 'bg-red-50', icon: Flag },
              { label: 'Open Disputes', value: openDisputes.length, color: 'text-purple-700', bg: 'bg-purple-50', icon: Scale },
            ].map(({ label, value, color, bg, icon: Icon }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
                <div className={`p-2.5 rounded-xl ${bg} w-fit mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Escrow Summary */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-950 rounded-3xl p-6 text-white grid grid-cols-1 sm:grid-cols-3 gap-5 shadow-blue-md">
            {[
              { label: 'Active Escrow (Locked)', value: `₹${totalEscrowed.toLocaleString('en-IN')}`, color: 'text-sky-300' },
              { label: 'Escrow Released (All Time)', value: `₹${escrowTransactions.filter(t => t.type === 'Release').reduce((a, t) => a + t.winnerPayout, 0).toLocaleString('en-IN')}`, color: 'text-green-300' },
              { label: 'Platform Revenue (Fees)', value: `₹${escrowTransactions.filter(t => t.type === 'Release').reduce((a, t) => a + t.platformFee, 0).toLocaleString('en-IN')}`, color: 'text-sky-200' },
            ].map(({ label, value, color }) => (
              <div key={label} className="border border-white/20 rounded-2xl p-4 bg-white/10 backdrop-blur-sm">
                <div className={`text-xl font-black font-mono ${color}`}>{value}</div>
                <div className="text-xs text-sky-100 font-medium mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Active Challenges Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-card">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <h2 className="font-bold text-slate-900 text-sm">All Challenges — Status Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-600 font-bold">
                  <tr>
                    <th className="px-5 py-4">Challenge</th>
                    <th className="px-5 py-4">Poster</th>
                    <th className="px-5 py-4">Track</th>
                    <th className="px-5 py-4">Reward</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Teams</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {challenges.map(ch => (
                    <tr key={ch.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900 max-w-xs truncate">{ch.title}</td>
                      <td className="px-5 py-4 text-xs text-slate-700 font-medium">{ch.posterName}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${ch.track === 'Public' ? 'badge-blue' : 'badge-purple'}`}>
                          {ch.track}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-blue-700 text-xs">₹{ch.rewardAmount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${
                          ch.status === 'Open'       ? 'badge-green' :
                          ch.status === 'Solved'     ? 'badge-slate' :
                          ch.status === 'In Progress' ? 'badge-blue'  : 'badge-amber'
                        }`}>{ch.status}</span>
                      </td>
                      <td className="px-5 py-4 text-center text-slate-800 font-mono text-xs font-bold">
                        {ch.teamsCount}/{ch.maxTeams}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Flagged Submissions */}
      {activeSection === 'submissions' && (
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900">Plagiarism / Similarity Flags</h2>
          {flagged.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="text-slate-600 font-medium text-sm">All submissions pass originality checks. No flags raised.</p>
            </div>
          ) : (
            flagged.map(sub => (
              <div key={sub.id} className="bg-white border border-red-200 rounded-2xl p-5 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src={sub.leadStudentAvatar} alt={sub.leadStudentName} className="w-10 h-10 rounded-xl object-cover border" />
                    <div>
                      <div className="font-bold text-slate-900">{sub.teamName} — {sub.leadStudentName}</div>
                      <div className="text-xs text-slate-500">{sub.challengeTitle}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-black font-mono text-red-600">{sub.plagiarismScore.toFixed(1)}%</div>
                    <div className="text-[10px] text-red-400 font-bold uppercase">Similarity</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="btn-secondary text-xs">Investigate</button>
                  <button className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 font-semibold">Flag for Manual Review</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Disputes */}
      {activeSection === 'disputes' && (
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900">Open Disputes</h2>
          {disputes.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <Scale className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No disputes raised. The platform trust & safety layer is working as intended.</p>
            </div>
          ) : (
            disputes.map(dispute => (
              <div key={dispute.id} className="bg-white border border-amber-200 rounded-2xl p-5 shadow-card">
                <div className="font-bold text-slate-900">{dispute.challengeTitle}</div>
                <div className="text-xs text-slate-500 mt-0.5">{dispute.studentName} vs {dispute.orgName}</div>
                <div className="mt-2 text-xs text-slate-600 bg-amber-50 border border-amber-100 p-3 rounded-xl">{dispute.reason}</div>
                {dispute.status === 'Open' && (
                  <div className="mt-3 space-y-2">
                    <select value={resolution} onChange={e => setResolution(e.target.value as any)} className="form-select text-xs">
                      <option value="Resolved - Student Paid">Resolve: Release escrow to student</option>
                      <option value="Resolved - Org Refunded">Resolve: Refund to organisation</option>
                    </select>
                    <input value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Admin resolution notes..." className="form-input text-xs" />
                    <button onClick={() => resolveDispute(dispute.id, resolution, adminNotes)} className="btn-primary text-xs">
                      Confirm Resolution
                    </button>
                  </div>
                )}
                {dispute.status !== 'Open' && (
                  <span className="badge badge-green mt-2">{dispute.status}</span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Escrow Ledger */}
      {activeSection === 'escrow' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-card">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm">Escrow Transaction Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">All escrow deposits, releases, and refunds across the platform.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                <tr>
                  <th className="px-5 py-3">Transaction</th>
                  <th className="px-5 py-3">Challenge</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Winner</th>
                  <th className="px-5 py-3">Others</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {escrowTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-500">{txn.txnRef}</td>
                    <td className="px-5 py-4 max-w-xs truncate text-xs text-slate-700 font-medium">{txn.challengeTitle}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${txn.type === 'Deposit' ? 'badge-blue' : txn.type === 'Release' ? 'badge-green' : 'badge-amber'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 font-mono text-blue-700 text-xs">₹{txn.winnerPayout.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 font-mono text-slate-500 text-xs">₹{txn.othersPayout.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${
                        txn.status === 'Completed' ? 'badge-green' :
                        txn.status === 'Locked in Escrow' ? 'badge-blue' : 'badge-amber'
                      }`}>{txn.status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(txn.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
