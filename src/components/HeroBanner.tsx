import React from 'react';
import { Search, ShieldCheck, CheckCircle2, Users, Zap, Award, Building2, Landmark } from 'lucide-react';

const SECTOR_TAGS = ['All', 'Infrastructure', 'Healthcare', 'Agriculture', 'Fintech', 'Environment', 'Smart Cities', 'Education', 'Governance'];

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSector: string;
  setSelectedSector: (s: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (d: string) => void;
  selectedTrack: string;
  setSelectedTrack: (t: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery, setSearchQuery,
  selectedSector, setSelectedSector,
  selectedDifficulty, setSelectedDifficulty,
  selectedTrack, setSelectedTrack,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Navy gradient hero */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 hero-gradient py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top eyebrow */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold backdrop-blur-sm text-center">
              <ShieldCheck className="w-4 h-4 text-sky-300 shrink-0" />
              <span className="hidden sm:inline">100% Escrow-Backed Rewards — Money locked before any team starts work</span>
              <span className="sm:hidden">100% Escrow-Backed · Guaranteed Payouts</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight sm:leading-tight">
              Real civic problems.
              <br className="hidden sm:inline" />
              <span className="text-sky-300"> Student-built solutions.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Government departments and startups post verified real-world challenges. Student teams solve them for guaranteed rewards, government recognition, and direct hiring opportunities.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { icon: CheckCircle2, label: 'Challenges Solved', value: '412+', color: 'text-sky-300' },
              { icon: Users,        label: 'Student Teams',    value: '3,800+', color: 'text-blue-100' },
              { icon: Award,        label: 'Rewards Released', value: '₹28.4L', color: 'text-sky-300' },
              { icon: Zap,          label: 'Avg. Solve Time',  value: '14 Days', color: 'text-blue-100' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${color} shrink-0`} />
                <div>
                  <div className="text-sm font-bold text-white">{value}</div>
                  <div className="text-[11px] text-blue-100 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Search & Filter Bar — white card floating below hero */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">

          {/* Search + Difficulty + Track Row */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search challenges by keyword, sector, skill..."
                className="form-input !pl-11 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-2.5">
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="form-select w-full sm:w-44 font-medium text-xs sm:text-sm"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>

              <select
                value={selectedTrack}
                onChange={e => setSelectedTrack(e.target.value)}
                className="form-select w-full sm:w-56 font-medium text-xs sm:text-sm"
              >
                <option value="All">All Tracks</option>
                <option value="Public">🏛 Gov / NGO</option>
                <option value="Private">🏢 Private Sector</option>
              </select>
            </div>
          </div>

          {/* Sector Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap mr-1">Sector:</span>
            {SECTOR_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedSector(tag)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border ${
                  selectedSector === tag
                    ? 'bg-blue-700 text-white border-blue-700 shadow-blue-sm font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
