import React, { useState } from 'react';
import { LEADERBOARD_STUDENTS } from '../data/mockData';
import { Trophy, Search, CheckCircle2, Briefcase, Award } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = LEADERBOARD_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.college.toLowerCase().includes(search.toLowerCase())
  );

  const rankStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-white';
    if (rank === 2) return 'bg-slate-300 text-slate-700';
    if (rank === 3) return 'bg-amber-700 text-white';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-3">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>National Student Solver Leaderboard</span>
        </div>
        <h1 className="section-title text-2xl sm:text-3xl">Top Civic Problem Solvers</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Rankings are based on challenge difficulty, solution acceptance rate, code originality score, and community peer reviews.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-sm mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search solver or university..."
            className="form-input pl-10" />
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {LEADERBOARD_STUDENTS.slice(0, 3).map(student => (
          <div key={student.name} className={`bg-white border rounded-3xl p-6 flex flex-col items-center text-center shadow-card ${
            student.rank === 1 ? 'border-amber-300 ring-2 ring-amber-200 md:-translate-y-2' :
            student.rank === 2 ? 'border-slate-200' : 'border-slate-200'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mb-3 ${rankStyle(student.rank)}`}>
              #{student.rank}
            </div>
            <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 mb-3 shadow-sm" />
            <div className="font-extrabold text-slate-900 text-sm">{student.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{student.college}</div>
            <div className="mt-3 flex items-center space-x-2">
              <span className="badge badge-blue text-xs">★ {student.rating}</span>
              <span className="badge badge-slate text-xs">{student.solved} solved</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Earned</span>
              <span className="font-bold text-blue-700 font-mono">₹{student.earned.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full flex items-center justify-between text-xs mt-1">
              <span className="text-slate-400">Hire Offers</span>
              <span className="font-bold text-teal-600 flex items-center space-x-1">
                <Briefcase className="w-3 h-3" /><span>{student.hireOffers}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400 uppercase tracking-widest font-bold">
              <tr>
                <th className="py-4 px-5">Rank</th>
                <th className="py-4 px-5">Solver</th>
                <th className="py-4 px-5">University</th>
                <th className="py-4 px-5">Top Sectors</th>
                <th className="py-4 px-5 text-right">Elo Rating</th>
                <th className="py-4 px-5 text-right">Total Earned</th>
                <th className="py-4 px-5 text-center">Offers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => (
                <tr key={student.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5">
                    <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${rankStyle(student.rank)}`}>
                      #{student.rank}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3">
                      <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          {student.name}
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="text-xs text-slate-400">{student.solved} challenges solved</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-600 text-xs">{student.college}</td>
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1">
                      {student.sectors?.slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-blue-700 font-mono">{student.rating}</td>
                  <td className="py-4 px-5 text-right font-bold text-slate-900 font-mono">₹{student.earned.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-5 text-center">
                    <span className="badge badge-slate">
                      <Briefcase className="w-3 h-3 text-teal-500" />
                      {student.hireOffers}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
