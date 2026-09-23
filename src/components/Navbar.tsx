import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Building2, ChevronDown, UserCheck, ShieldCheck,
  PlusCircle, Award, Wallet, Users, LayoutDashboard, Landmark
} from 'lucide-react';
import setuLogoSrc from '../assets/setu-logo.png';

// Setu logo using the uploaded brand image
const SetuLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <img
      src={setuLogoSrc}
      alt="Setu"
      className="h-9 w-auto object-contain"
    />
    <div className="text-[11px] text-slate-600 leading-tight font-semibold hidden sm:block">
      Bridging Problems to Solutions
    </div>
  </div>
);

export const Navbar: React.FC = () => {
  const { role, currentUser, switchRole, activeTab, setActiveTab, setIsPostModalOpen, submissions, hireInterests } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pendingReviews = submissions.filter(s => s.status === 'Pending Review').length;
  const activeHires = hireInterests.length;

  const NavBtn = ({ tab, label, icon: Icon, badge }: { tab: string; label: string; icon: React.ElementType; badge?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
        activeTab === tab ? 'bg-blue-700 text-white shadow-blue-sm' : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-blue-700 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );

  const roleConfig: Record<UserRole, { label: string; color: string; bg: string }> = {
    student:    { label: 'Student',    color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200' },
    company:    { label: 'Company',    color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    government: { label: 'Govt. Dept', color: 'text-navy-700',  bg: 'bg-slate-100 border-slate-200' },
    admin:      { label: 'Admin',      color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center space-x-6">
          <button onClick={() => setActiveTab('explore')} className="focus:outline-none">
            <SetuLogo />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavBtn tab="explore" label="Challenges" icon={LayoutDashboard} />
            <NavBtn tab="leaderboard" label="Leaderboard" icon={Award} />
            {role === 'student' && (
              <NavBtn tab="student-dash" label="My Solutions" icon={Wallet} />
            )}
            {(role === 'company' || role === 'government') && (
              <>
                <NavBtn tab="org-dashboard" label="Review Inbox" icon={Building2} badge={pendingReviews} />
                <NavBtn tab="hire-pipeline" label="Talent Pipeline" icon={Users} badge={activeHires} />
              </>
            )}
            {role === 'admin' && (
              <NavBtn tab="admin-portal" label="Admin Panel" icon={ShieldCheck} />
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Post Challenge CTA */}
          {(role === 'company' || role === 'government') && (
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-2.5 sm:px-4 font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Post Challenge</span>
              <span className="sm:hidden">Post</span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm transition-colors shadow-sm"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className={`text-[10px] font-bold uppercase ${roleConfig[role].color}`}>{roleConfig[role].label}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fade-up"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  Switch Demo Persona
                </div>

                {([
                  { r: 'student' as UserRole, name: 'Rahul Sharma', sub: 'Student — IIT Delhi', icon: UserCheck, color: 'text-blue-700 bg-blue-50' },
                  { r: 'government' as UserRole, name: 'Priya Mishra', sub: 'Govt. Dept — Jharkhand IT', icon: Landmark, color: 'text-slate-700 bg-slate-50' },
                  { r: 'company' as UserRole, name: 'Arjun Kapoor', sub: 'Company — RuralFintech', icon: Building2, color: 'text-indigo-700 bg-indigo-50' },
                  { r: 'admin' as UserRole, name: 'Setu Trust & Safety', sub: 'Admin / Moderation', icon: ShieldCheck, color: 'text-red-700 bg-red-50' },
                ] as const).map(({ r, name, sub, icon: Icon, color }) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${role === r ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{name}</div>
                      <div className="text-[11px] text-slate-400">{sub}</div>
                    </div>
                    {role === r && <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
