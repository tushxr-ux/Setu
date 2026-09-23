import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Submission } from '../types';
import { Github, Video, ExternalLink, CheckCircle2, XCircle, UserCheck, ShieldCheck, AlertTriangle, ChevronDown, Coins } from 'lucide-react';

export const OrgDashboard: React.FC = () => {
  const { currentUser, challenges, submissions, reviewSubmission, markHireInterested, setIsPostModalOpen } = useApp();
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isHireOpen, setIsHireOpen] = useState(false);
  const [hireRole, setHireRole] = useState('Product Engineer');
  const [hireComp, setHireComp] = useState('₹18 – 24 LPA');
  const [hireNotes, setHireNotes] = useState('');

  const orgChallenges = challenges.filter(c =>
    c.posterId === currentUser.id || c.posterName === currentUser.orgName
  );
  const orgSubmissions = submissions.filter(s =>
    orgChallenges.some(c => c.id === s.challengeId)
  );

  const activeSub = submissions.find(s => s.id === selectedSubId) || orgSubmissions[0];
  const activeCh = challenges.find(c => c.id === activeSub?.challengeId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Org Stats Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
            <img src={currentUser.orgLogo || currentUser.avatar} alt={currentUser.orgName} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">{currentUser.orgName || currentUser.name}</h1>
              <span className="badge badge-blue">Verified Organisation</span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{currentUser.name} • {currentUser.orgDomain || currentUser.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center sm:min-w-[120px]">
            <div className="text-[11px] sm:text-xs text-slate-600 font-bold uppercase tracking-wider">Active Challenges</div>
            <div className="text-lg sm:text-xl font-extrabold text-blue-700 mt-0.5">{orgChallenges.length}</div>
          </div>
          <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center sm:min-w-[120px]">
            <div className="text-[11px] sm:text-xs text-slate-600 font-bold uppercase tracking-wider">Pending Review</div>
            <div className="text-lg sm:text-xl font-extrabold text-amber-600 mt-0.5">{orgSubmissions.filter(s => s.status === 'Pending Review').length}</div>
          </div>
          <button onClick={() => setIsPostModalOpen(true)} className="col-span-2 sm:col-span-1 btn-primary text-xs sm:text-sm py-2.5 sm:py-2.5 justify-center">+ Post Challenge</button>
        </div>
      </div>

      {/* Review Inbox */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-slate-900">Submission Review Inbox</h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Review team solutions, run originality checks, accept with escrow release, or mark teams for hiring.</p>
        </div>

        {/* Mobile View Switcher */}
        {orgSubmissions.length > 0 && (
          <div className="lg:hidden flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1 mb-4">
            <button
              onClick={() => setMobileTab('list')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mobileTab === 'list'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Submissions ({orgSubmissions.length})
            </button>
            <button
              onClick={() => setMobileTab('detail')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mobileTab === 'detail'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Review Details
            </button>
          </div>
        )}

        {orgSubmissions.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">No submissions yet for your active challenges.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left: Submission List */}
            <div className={`lg:col-span-5 space-y-2 ${mobileTab === 'detail' ? 'hidden lg:block' : 'block'}`}>
              {orgSubmissions.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubId(sub.id);
                    setMobileTab('detail');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeSub?.id === sub.id
                      ? 'border-blue-500 bg-blue-50/80 shadow-blue-sm'
                      : 'border-slate-200 bg-white hover:border-blue-300 shadow-card'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={sub.leadStudentAvatar} alt={sub.leadStudentName} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{sub.teamName}</div>
                        <div className="text-xs text-slate-600 font-medium">{sub.leadStudentName} • {sub.leadStudentCollege}</div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      sub.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                      sub.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>{sub.status}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-800 font-semibold line-clamp-1">{sub.challengeTitle}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className={`font-mono ${sub.plagiarismFlagged ? 'text-red-600 font-bold' : 'text-green-700 font-semibold'}`}>
                      Similarity: {sub.plagiarismScore}%
                    </span>
                    <span className="text-slate-600 font-medium">{sub.memberCount} member{sub.memberCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Detail Panel */}
            {activeSub && (
              <div className={`lg:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-card overflow-hidden ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>

                {/* Mobile Back Header */}
                <div className="lg:hidden px-4 py-2.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between">
                  <button
                    onClick={() => setMobileTab('list')}
                    className="text-xs text-blue-700 font-bold flex items-center space-x-1"
                  >
                    <span>← Back to Submissions</span>
                  </button>
                  <span className="text-[11px] text-slate-600 font-semibold">{activeSub.teamName}</span>
                </div>

                {/* Panel Header */}
                <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <img src={activeSub.leadStudentAvatar} alt={activeSub.leadStudentName} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <div className="font-extrabold text-slate-900 flex items-center space-x-2">
                        <span>{activeSub.teamName}</span>
                        <span className="badge badge-blue">Rating {activeSub.leadStudentRating}</span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium">{activeSub.leadStudentCollege} • {activeSub.memberCount} member team</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a href={activeSub.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-ghost text-xs px-2.5 py-1.5 font-semibold">
                      <Github className="w-3.5 h-3.5" /><span>Code</span><ExternalLink className="w-3 h-3" />
                    </a>
                    {activeSub.demoUrl && (
                      <a href={activeSub.demoUrl} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost text-xs px-2.5 py-1.5 font-semibold">
                        <Video className="w-3.5 h-3.5" /><span>Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Plagiarism Status */}
                <div className={`mx-5 mt-5 p-4 rounded-2xl border flex items-center justify-between ${
                  activeSub.plagiarismFlagged
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center space-x-2.5 text-xs">
                    {activeSub.plagiarismFlagged
                      ? <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                      : <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                    }
                    <div>
                      <div className={`font-bold ${activeSub.plagiarismFlagged ? 'text-red-800' : 'text-green-800'}`}>
                        {activeSub.plagiarismFlagged ? 'High Similarity Flagged for Review' : 'Originality Verified'}
                      </div>
                      <div className="text-slate-700 font-medium mt-0.5">Similarity Index: <span className="font-mono font-bold text-slate-900">{activeSub.plagiarismScore}%</span></div>
                    </div>
                  </div>
                  {activeSub.milestones && (
                    <div className="text-xs text-right">
                      <div className="font-bold text-slate-800">{activeSub.milestones.filter(m => m.completed).length}/{activeSub.milestones.length}</div>
                      <div className="text-slate-600 font-medium">Milestones</div>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                {activeSub.milestones && (
                  <div className="mx-5 mt-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">Criteria Checklist</div>
                    <div className="space-y-1.5">
                      {activeSub.milestones.map((m, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs">
                          {m.completed
                            ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          }
                          <span className={m.completed ? 'text-slate-800 font-medium' : 'text-slate-500 line-through font-medium'}>{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Writeup */}
                <div className="mx-5 mt-4 mb-5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">Technical Writeup</div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto font-normal">
                    {activeSub.writeup}
                  </div>
                </div>

                {/* Actions */}
                {activeSub.status === 'Pending Review' && (
                  <div className="px-4 sm:px-5 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setIsHireOpen(true)}
                      className="btn-secondary text-xs w-full sm:w-auto justify-center"
                    >
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      <span>Add to Hiring Pipeline</span>
                    </button>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button onClick={() => setIsRejecting(true)} className="flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center space-x-1.5">
                        <XCircle className="w-4 h-4" /><span>Reject</span>
                      </button>
                      <button onClick={() => reviewSubmission(activeSub.id, 'Accepted')}
                        className="flex-1 sm:flex-initial btn-primary text-xs justify-center">
                        <Coins className="w-4 h-4" />
                        <span className="hidden sm:inline">Accept & Release Escrow</span>
                        <span className="sm:hidden">Accept & Release</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeSub.status !== 'Pending Review' && activeSub.feedback && (
                  <div className="mx-5 mb-5 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-slate-800 italic">
                    Feedback: "{activeSub.feedback}"
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900">Rejection Feedback</h3>
            <p className="text-xs text-slate-500">Let {activeSub?.teamName} know why their solution did not meet the criteria.</p>
            <textarea rows={3} value={rejectFeedback} onChange={e => setRejectFeedback(e.target.value)}
              placeholder="e.g. Offline sync not implemented, accuracy below 80% threshold..."
              className="form-textarea" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsRejecting(false)} className="btn-ghost text-xs">Cancel</button>
              <button onClick={() => { reviewSubmission(activeSub!.id, 'Rejected', rejectFeedback); setIsRejecting(false); }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hire Modal */}
      {isHireOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><UserCheck className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-slate-900">Add to Hiring Pipeline</h3>
                <p className="text-xs text-slate-400">{activeSub?.leadStudentName} — {activeSub?.leadStudentCollege}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Target Role</label>
              <input value={hireRole} onChange={e => setHireRole(e.target.value)} className="form-input text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Compensation Range</label>
              <input value={hireComp} onChange={e => setHireComp(e.target.value)} className="form-input text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Notes</label>
              <textarea rows={2} value={hireNotes} onChange={e => setHireNotes(e.target.value)} className="form-textarea text-sm" placeholder="Why are you interested in this candidate?" />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsHireOpen(false)} className="btn-ghost text-xs">Cancel</button>
              <button onClick={() => { markHireInterested(activeSub!, hireRole, hireComp, hireNotes); setIsHireOpen(false); }}
                className="btn-primary text-xs">Add to Pipeline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
