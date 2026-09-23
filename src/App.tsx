import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ChallengeCard } from './components/ChallengeCard';
import { ChallengeDetailModal } from './components/ChallengeDetailModal';
import { PostChallengeModal } from './components/PostChallengeModal';
import { SubmitSolutionModal } from './components/SubmitSolutionModal';
import { StudentDashboard } from './components/StudentDashboard';
import { OrgDashboard } from './components/OrgDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { HirePipelineView } from './components/HirePipelineView';
import { AdminPortal } from './components/AdminPortal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckCircle, X, Info, AlertTriangle } from 'lucide-react';

const Toast: React.FC<{ message: string; type: 'success' | 'info' | 'warning'; onClose: () => void }> = ({
  message, type, onClose
}) => {
  const styles = {
    success: 'bg-white border-green-300 shadow-md',
    info:    'bg-white border-blue-300 shadow-md',
    warning: 'bg-white border-amber-300 shadow-md',
  };
  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    info:    <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  };

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-5 z-[100] flex items-center space-x-3 border rounded-2xl px-4 py-3 max-w-sm animate-fade-up ${styles[type]}`}>
      {icons[type]}
      <span className="text-sm text-slate-800 font-medium">{message}</span>
      <button onClick={onClose} className="ml-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
    </div>
  );
};

export default function App() {
  const {
    role, activeTab, setActiveTab, challenges, selectedChallenge, setSelectedChallenge,
    isPostModalOpen, isSubmitModalOpen, setIsSubmitModalOpen,
    toastMessage, toastType, showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTrack, setSelectedTrack] = useState('All');

  const filteredChallenges = challenges.filter(ch => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      ch.title.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q) ||
      ch.tags.some(t => t.toLowerCase().includes(q)) ||
      ch.sector.toLowerCase().includes(q);
    const matchesSector = selectedSector === 'All' || ch.sector === selectedSector;
    const matchesDifficulty = selectedDifficulty === 'All' || ch.difficulty === selectedDifficulty;
    const matchesTrack = selectedTrack === 'All' || ch.track === selectedTrack;
    return matchesSearch && matchesSector && matchesDifficulty && matchesTrack;
  });

  const isExplore = activeTab === 'explore';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 md:pb-0">
      <Navbar />

      {/* Challenge Feed */}
      {isExplore && (
        <>
          <HeroBanner
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            selectedSector={selectedSector} setSelectedSector={setSelectedSector}
            selectedDifficulty={selectedDifficulty} setSelectedDifficulty={setSelectedDifficulty}
            selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title">Open Challenges</h2>
                <p className="section-subtitle">
                  {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} found
                  {(selectedSector !== 'All' || selectedTrack !== 'All') && ` · Filtered`}
                </p>
              </div>
            </div>

            {filteredChallenges.length === 0 ? (
              <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl shadow-card">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-slate-700">No challenges match your filters</h3>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your search or sector filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-up">
                {filteredChallenges.map(ch => (
                  <ChallengeCard
                    key={ch.id}
                    challenge={ch}
                    onSelect={setSelectedChallenge}
                  />
                ))}
              </div>
            )}

            {/* How It Works */}
            <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-8 shadow-card">
              <h3 className="text-xl font-extrabold text-slate-900 text-center mb-8">How Setu Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Verified Problem Posted',
                    body: 'A government department or company posts a real challenge with a fully escrowed reward — money is locked before any team starts work.',
                    color: 'bg-blue-700',
                  },
                  {
                    step: '02',
                    title: 'Student Teams Solve',
                    body: 'Student teams discover matching challenges, form teams, collaborate in a shared workspace, and submit their solutions with milestones and evidence.',
                    color: 'bg-sky-500',
                  },
                  {
                    step: '03',
                    title: 'Verified & Rewarded',
                    body: 'On acceptance, escrow releases automatically. Winner gets 70%, all other finishers share 30%. Non-winners keep full IP. Top solvers get hiring offers.',
                    color: 'bg-blue-900',
                  },
                ].map(({ step, title, body, color }) => (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white font-black text-sm mb-4 shadow-blue-md`}>
                      {step}
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 mb-2">{title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{body}</p>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </>
      )}

      {activeTab === 'student-dash' && role === 'student' && <StudentDashboard />}
      {activeTab === 'org-dashboard' && (role === 'company' || role === 'government') && <OrgDashboard />}
      {activeTab === 'leaderboard' && <LeaderboardView />}
      {activeTab === 'hire-pipeline' && (role === 'company' || role === 'government') && <HirePipelineView />}
      {activeTab === 'admin-portal' && role === 'admin' && <AdminPortal />}

      {/* Modals */}
      {isPostModalOpen && <PostChallengeModal />}

      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onOpenSubmit={() => setIsSubmitModalOpen(true)}
        />
      )}

      {isSubmitModalOpen && selectedChallenge && (
        <SubmitSolutionModal
          challenge={selectedChallenge}
          onClose={() => setIsSubmitModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => showToast('', 'success')} />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-extrabold text-slate-900 text-sm">Setu</span>
              <span className="ml-1.5 text-slate-600">— Bridging Civic Problems to Student Solutions</span>
            </div>

            {/* Footer Navigation: Challenges, Leaders, Inbox, Talent */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-semibold">
              <button
                onClick={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-3 py-1.5 rounded-xl transition-colors ${activeTab === 'explore' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'}`}
              >
                Challenges
              </button>
              <button
                onClick={() => { setActiveTab('leaderboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-3 py-1.5 rounded-xl transition-colors ${activeTab === 'leaderboard' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'}`}
              >
                Leaders
              </button>
              {role === 'student' && (
                <button
                  onClick={() => { setActiveTab('student-dash'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${activeTab === 'student-dash' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'}`}
                >
                  My Work
                </button>
              )}
              {(role === 'company' || role === 'government') && (
                <>
                  <button
                    onClick={() => { setActiveTab('org-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`px-3 py-1.5 rounded-xl transition-colors ${activeTab === 'org-dashboard' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'}`}
                  >
                    Inbox
                  </button>
                  <button
                    onClick={() => { setActiveTab('hire-pipeline'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`px-3 py-1.5 rounded-xl transition-colors ${activeTab === 'hire-pipeline' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'}`}
                  >
                    Talent
                  </button>
                </>
              )}
              {role === 'admin' && (
                <button
                  onClick={() => { setActiveTab('admin-portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${activeTab === 'admin-portal' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'}`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-slate-700">SIH 2026 · PS26043</span>
              <span>·</span>
              <span>Built with ❤️ for India</span>
            </div>
            <div className="text-blue-700 font-bold">
              100% Escrow-Backed Rewards
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Fixed Bottom Navigation Bar for Mobile */}
      <MobileBottomNav />
    </div>
  );
}
