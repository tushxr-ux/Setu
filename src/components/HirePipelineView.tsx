import React from 'react';
import { useApp } from '../context/AppContext';
import { HireStatus } from '../types';
import { Users, ChevronRight, Phone, Briefcase, UserCheck } from 'lucide-react';

const HIRE_STAGES: HireStatus[] = ['Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Placed'];
const STAGE_COLORS: Record<HireStatus, string> = {
  'Shortlisted':           'bg-slate-100 border-slate-300 text-slate-800 font-bold',
  'Interview Scheduled':   'bg-blue-50 border-blue-200 text-blue-800 font-bold',
  'Offer Extended':        'bg-amber-50 border-amber-200 text-amber-800 font-bold',
  'Placed':                'bg-green-50 border-green-200 text-green-800 font-bold',
};

export const HirePipelineView: React.FC = () => {
  const { hireInterests, updateHireStatus, currentUser } = useApp();

  const orgHires = hireInterests.filter(h => h.orgId === currentUser.id || true); // show all in demo

  const byStage = HIRE_STAGES.reduce((acc, stage) => {
    acc[stage] = orgHires.filter(h => h.status === stage);
    return acc;
  }, {} as Record<HireStatus, typeof orgHires>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><Users className="w-5 h-5" /></div>
            <span>Talent Pipeline</span>
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Students you marked for hiring after reviewing their challenge solutions. Move them through stages below.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-700 font-semibold bg-white border border-slate-300 rounded-xl px-4 py-2.5 shadow-sm">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>{orgHires.length} candidate{orgHires.length !== 1 ? 's' : ''} in pipeline</span>
        </div>
      </div>

      {/* Kanban Board */}
      {orgHires.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-2xl border border-slate-200">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Candidates Yet</h3>
          <p className="text-sm text-slate-600 font-medium mt-1 max-w-sm mx-auto">
            Go to Review Inbox, evaluate a submission, and click "Add to Hiring Pipeline" to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HIRE_STAGES.map(stage => (
            <div key={stage} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
              {/* Stage Header */}
              <div className={`px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70`}>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{stage}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STAGE_COLORS[stage]}`}>
                  {byStage[stage].length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 min-h-[100px]">
                {byStage[stage].map(hire => (
                  <div key={hire.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <img src={hire.studentAvatar} alt={hire.studentName} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{hire.studentName}</div>
                        <div className="text-xs text-slate-600 font-medium truncate">{hire.studentCollege}</div>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{hire.roleOffered}</span>
                      </div>
                      <div className="text-blue-700 font-bold font-mono text-xs">{hire.compensationRange}</div>
                      <div className="text-slate-600 text-xs font-medium">Re: {hire.challengeTitle}</div>
                    </div>

                    {hire.notes && (
                      <p className="text-xs text-slate-700 italic line-clamp-2">"{hire.notes}"</p>
                    )}

                    {/* Move Forward */}
                    {stage !== 'Placed' && (
                      <button
                        onClick={() => {
                          const nextIdx = HIRE_STAGES.indexOf(stage) + 1;
                          if (nextIdx < HIRE_STAGES.length) updateHireStatus(hire.id, HIRE_STAGES[nextIdx]);
                        }}
                        className="w-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg py-1.5 transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>Move to {HIRE_STAGES[HIRE_STAGES.indexOf(stage) + 1]}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {stage === 'Placed' && (
                      <div className="text-xs text-center font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg py-1.5">
                        🎉 Successfully Placed
                      </div>
                    )}
                  </div>
                ))}

                {byStage[stage].length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-500 font-medium italic">No candidates in this stage</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
