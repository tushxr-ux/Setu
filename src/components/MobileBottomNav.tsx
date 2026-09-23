import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Award, Wallet, Building2, Users, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { role, activeTab, setActiveTab, submissions, hireInterests } = useApp();

  const pendingReviews = submissions.filter(s => s.status === 'Pending Review').length;
  const activeHires = hireInterests.length;

  const navItems = [
    { tab: 'explore', label: 'Challenges', icon: LayoutDashboard },
    { tab: 'leaderboard', label: 'Leaders', icon: Award },
    ...(role === 'student' ? [{ tab: 'student-dash', label: 'My Work', icon: Wallet }] : []),
    ...(role === 'company' || role === 'government' ? [
      { tab: 'org-dashboard', label: 'Inbox', icon: Building2, badge: pendingReviews },
      { tab: 'hire-pipeline', label: 'Talent', icon: Users, badge: activeHires }
    ] : []),
    ...(role === 'admin' ? [{ tab: 'admin-portal', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-2xl"
    >
      {navItems.map(({ tab, label, icon: Icon, badge }) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
              isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700 stroke-[2.2]' : 'text-slate-500'}`} />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-blue-700' : 'font-medium text-slate-500'}`}>
              {label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
