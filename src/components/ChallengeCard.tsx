import React from 'react';
import { Challenge } from '../types';
import { ShieldCheck, Clock, CheckCircle2, ArrowRight, Users, Smartphone, Globe, Cpu, Landmark, Building2 } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (ch: Challenge) => void;
}

const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner:     'bg-green-50  text-green-700  border-green-200',
  Intermediate: 'bg-blue-50   text-blue-700   border-blue-200',
  Advanced:     'bg-amber-50  text-amber-700  border-amber-200',
  Expert:       'bg-purple-50 text-purple-700 border-purple-200',
};

const SECTOR_COLORS: Record<string, string> = {
  'Infrastructure':   'bg-slate-100 text-slate-700',
  'Healthcare':       'bg-red-50    text-red-700',
  'Agriculture':      'bg-green-50  text-green-700',
  'Fintech':          'bg-indigo-50 text-indigo-700',
  'Environment':      'bg-teal-50   text-teal-700',
  'Smart Cities':     'bg-cyan-50   text-cyan-700',
  'Education':        'bg-yellow-50 text-yellow-700',
  'Governance':       'bg-blue-50   text-blue-700',
  'Water & Sanitation': 'bg-sky-50  text-sky-700',
  'Other':            'bg-slate-100 text-slate-600',
};

const DEV_TYPE_ICON = {
  web:    Globe,
  mobile: Smartphone,
  iot:    Cpu,
  any:    CheckCircle2,
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge: ch, onSelect }) => {
  const daysLeft = () => {
    const diff = new Date(ch.deadline).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return { label: 'Deadline passed', urgent: true };
    if (days === 0) return { label: 'Ends today', urgent: true };
    if (days <= 3) return { label: `${days}d left`, urgent: true };
    return { label: `${days}d left`, urgent: false };
  };

  const { label: daysLabel, urgent } = daysLeft();
  const DevIcon = DEV_TYPE_ICON[ch.requiresDevType] || CheckCircle2;
  const PosterIcon = ch.posterType === 'government' ? Landmark : Building2;

  const statusDot = () => {
    switch (ch.status) {
      case 'Open':        return <span className="flex items-center space-x-1.5 text-xs text-green-600 font-semibold"><span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />Open</span>;
      case 'In Progress': return <span className="flex items-center space-x-1.5 text-xs text-blue-600 font-semibold"><span className="w-2 h-2 rounded-full bg-blue-500" />In Progress</span>;
      case 'Solved':      return <span className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />Solved</span>;
      case 'Under Review': return <span className="flex items-center space-x-1.5 text-xs text-amber-600 font-semibold"><span className="w-2 h-2 rounded-full bg-amber-500" />Under Review</span>;
      default:            return <span className="text-xs text-slate-400">{ch.status}</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(ch)}
      className="group bg-white border border-slate-200 hover:border-blue-300 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden"
    >
      {/* Track stripe */}
      <div className={`h-1 w-full ${ch.track === 'Public' ? 'bg-gradient-to-r from-blue-700 to-sky-400' : 'bg-gradient-to-r from-indigo-600 to-purple-500'}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Poster */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
              <img src={ch.posterLogo} alt={ch.posterName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <PosterIcon className={`w-3 h-3 shrink-0 ${ch.posterType === 'government' ? 'text-slate-600' : 'text-indigo-500'}`} />
                <span className="text-xs font-semibold text-slate-600 line-clamp-1">{ch.posterName}</span>
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                {statusDot()}
                <span className="text-slate-300">•</span>
                <span className={`text-[11px] font-medium ${urgent ? 'text-red-600' : 'text-slate-400'}`}>
                  <Clock className="inline w-3 h-3 mr-0.5" />{daysLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Track badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            ch.track === 'Public'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            {ch.track === 'Public' ? '🏛 GOVT' : '🏢 PRIVATE'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-2 line-clamp-2">
          {ch.title}
        </h2>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 flex-1">
          {ch.description.split('\n')[0]}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${DIFFICULTY_STYLE[ch.difficulty]}`}>
            {ch.difficulty}
          </span>
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${SECTOR_COLORS[ch.sector] || SECTOR_COLORS['Other']}`}>
            {ch.sector}
          </span>
          {ch.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              {tag}
            </span>
          ))}
          {ch.tags.length > 2 && <span className="text-[11px] text-slate-400">+{ch.tags.length - 2}</span>}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-blue-700 font-mono">
              {ch.rewardType === 'cash' || ch.rewardType === 'hybrid'
                ? `₹${ch.rewardAmount.toLocaleString('en-IN')}`
                : 'Certificate'}
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-green-600 font-semibold">Escrow Locked</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5" />
              <span>{ch.teamsCount} team{ch.teamsCount !== 1 ? 's' : ''}</span>
            </span>
            <span className="flex items-center space-x-1 text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
