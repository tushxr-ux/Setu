import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User, UserRole, Challenge, Submission, EscrowTransaction, HireInterest, Dispute, HireStatus,
} from '../types';
import {
  INITIAL_STUDENT_USER, INITIAL_GOV_USER, INITIAL_COMPANY_USER, INITIAL_ADMIN_USER,
  INITIAL_CHALLENGES, INITIAL_SUBMISSIONS, INITIAL_ESCROW_TRANSACTIONS,
  INITIAL_HIRE_INTERESTS, INITIAL_DISPUTES,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  currentUser: User;
  switchRole: (newRole: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  challenges: Challenge[];
  submissions: Submission[];
  escrowTransactions: EscrowTransaction[];
  hireInterests: HireInterest[];
  disputes: Dispute[];
  selectedChallenge: Challenge | null;
  setSelectedChallenge: (ch: Challenge | null) => void;
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  isSubmitModalOpen: boolean;
  setIsSubmitModalOpen: (open: boolean) => void;
  postChallenge: (data: Partial<Challenge>) => void;
  submitSolution: (data: {
    challengeId: string; teamName: string; githubUrl: string;
    prUrl?: string; writeup: string; demoUrl?: string;
  }) => void;
  reviewSubmission: (submissionId: string, decision: 'Accepted' | 'Rejected', feedback?: string) => void;
  markHireInterested: (sub: Submission, roleOffered: string, compensationRange: string, notes: string) => void;
  updateHireStatus: (hireId: string, status: HireStatus) => void;
  resolveDispute: (disputeId: string, resolution: 'Resolved - Student Paid' | 'Resolved - Org Refunded', adminNotes: string) => void;
  withdrawWallet: (amount: number, upi: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  toastType: 'success' | 'info' | 'warning';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem('setu_role') as UserRole) || 'student');
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const s = localStorage.getItem('setu_challenges');
    return s ? JSON.parse(s) : INITIAL_CHALLENGES;
  });
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const s = localStorage.getItem('setu_submissions');
    return s ? JSON.parse(s) : INITIAL_SUBMISSIONS;
  });
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>(() => {
    const s = localStorage.getItem('setu_escrow');
    return s ? JSON.parse(s) : INITIAL_ESCROW_TRANSACTIONS;
  });
  const [hireInterests, setHireInterests] = useState<HireInterest[]>(() => {
    const s = localStorage.getItem('setu_hires');
    return s ? JSON.parse(s) : INITIAL_HIRE_INTERESTS;
  });
  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const s = localStorage.getItem('setu_disputes');
    return s ? JSON.parse(s) : INITIAL_DISPUTES;
  });
  const [studentUser, setStudentUser] = useState<User>(() => {
    const s = localStorage.getItem('setu_student');
    return s ? JSON.parse(s) : INITIAL_STUDENT_USER;
  });
  const [govUser] = useState<User>(INITIAL_GOV_USER);
  const [companyUser] = useState<User>(INITIAL_COMPANY_USER);
  const [adminUser] = useState<User>(INITIAL_ADMIN_USER);

  useEffect(() => { localStorage.setItem('setu_role', role); }, [role]);
  useEffect(() => { localStorage.setItem('setu_challenges', JSON.stringify(challenges)); }, [challenges]);
  useEffect(() => { localStorage.setItem('setu_submissions', JSON.stringify(submissions)); }, [submissions]);
  useEffect(() => { localStorage.setItem('setu_escrow', JSON.stringify(escrowTransactions)); }, [escrowTransactions]);
  useEffect(() => { localStorage.setItem('setu_hires', JSON.stringify(hireInterests)); }, [hireInterests]);
  useEffect(() => { localStorage.setItem('setu_disputes', JSON.stringify(disputes)); }, [disputes]);
  useEffect(() => { localStorage.setItem('setu_student', JSON.stringify(studentUser)); }, [studentUser]);

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    const tabMap: Record<UserRole, string> = {
      student: 'explore',
      company: 'org-dashboard',
      government: 'org-dashboard',
      admin: 'admin-portal',
    };
    setActiveTab(tabMap[newRole]);
    showToast(`Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} view`, 'info');
  };

  const currentUser =
    role === 'student' ? studentUser :
    role === 'government' ? govUser :
    role === 'company' ? companyUser : adminUser;

  const postChallenge = (data: Partial<Challenge>) => {
    const id = `ch_${Date.now()}`;
    const txnRef = `ESC_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const reward = Number(data.rewardAmount) || 20000;
    const platformFee = data.track === 'Private' ? Math.round(reward * 0.07) : 0;

    const newChallenge: Challenge = {
      id,
      posterId: currentUser.id,
      posterName: currentUser.orgName || currentUser.name,
      posterLogo: currentUser.orgLogo || currentUser.avatar,
      posterType: currentUser.orgType || (role === 'government' ? 'government' : 'company'),
      track: data.track || 'Public',
      title: data.title || 'Untitled Challenge',
      description: data.description || '',
      sector: data.sector || 'Other',
      tags: data.tags || [],
      difficulty: data.difficulty || 'Intermediate',
      rewardAmount: reward,
      rewardType: data.rewardType || (data.track === 'Private' ? 'cash' : 'hybrid'),
      escrowStatus: 'Funded',
      escrowTxnId: txnRef,
      deadline: data.deadline || new Date(Date.now() + 21 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      locationScope: data.locationScope || 'National',
      locationState: data.locationState,
      status: 'Open',
      submissionsCount: 0,
      teamsCount: 0,
      requiresDevType: data.requiresDevType || 'any',
      acceptanceCriteria: data.acceptanceCriteria || [],
      problemStatement: data.problemStatement,
      expectedOutcome: data.expectedOutcome,
      rewardSplit: { winner: 70, others: 30 },
    };

    const txn: EscrowTransaction = {
      id: `TXN_${Date.now()}`,
      challengeId: id,
      challengeTitle: newChallenge.title,
      amount: reward,
      platformFee,
      winnerPayout: Math.round(reward * 0.7) - platformFee,
      othersPayout: Math.round(reward * 0.3),
      type: 'Deposit',
      status: 'Locked in Escrow',
      timestamp: new Date().toISOString(),
      txnRef,
    };

    setChallenges(prev => [newChallenge, ...prev]);
    setEscrowTransactions(prev => [txn, ...prev]);
    setIsPostModalOpen(false);
    showToast(`Challenge posted & ₹${reward.toLocaleString('en-IN')} locked in Escrow!`);
  };

  const submitSolution = (data: {
    challengeId: string; teamName: string; githubUrl: string;
    prUrl?: string; writeup: string; demoUrl?: string;
  }) => {
    const ch = challenges.find(c => c.id === data.challengeId);
    const isSus = data.writeup.length < 50;
    const score = isSus ? 72 + Math.random() * 20 : +(Math.random() * 7 + 1.5).toFixed(1);
    const flagged = score > 40;

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      challengeId: data.challengeId,
      challengeTitle: ch?.title || 'Challenge',
      teamName: data.teamName || `${studentUser.name}'s Team`,
      leadStudentId: studentUser.id,
      leadStudentName: studentUser.name,
      leadStudentAvatar: studentUser.avatar,
      leadStudentCollege: studentUser.college || 'Your University',
      leadStudentRating: studentUser.rating || 1500,
      memberCount: 1,
      githubUrl: data.githubUrl,
      prUrl: data.prUrl,
      writeup: data.writeup,
      demoUrl: data.demoUrl,
      status: 'Pending Review',
      submittedAt: new Date().toISOString(),
      plagiarismScore: score,
      plagiarismFlagged: flagged,
    };

    setSubmissions(prev => [newSub, ...prev]);
    setChallenges(prev => prev.map(c =>
      c.id === data.challengeId ? { ...c, submissionsCount: c.submissionsCount + 1 } : c
    ));
    setIsSubmitModalOpen(false);
    showToast(
      flagged
        ? `Submitted! Warning: ${score.toFixed(1)}% similarity flagged for admin review.`
        : `Solution submitted! Similarity check passed (${score.toFixed(1)}%).`
    );
  };

  const reviewSubmission = (submissionId: string, decision: 'Accepted' | 'Rejected', feedback?: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    const ch = challenges.find(c => c.id === sub.challengeId);
    const reward = ch?.rewardAmount || 20000;
    const platformFee = ch?.track === 'Private' ? Math.round(reward * 0.07) : 0;
    const winnerPayout = Math.round(reward * 0.7) - platformFee;
    const othersPayout = Math.round(reward * 0.3);

    setSubmissions(prev => prev.map(s => s.id === submissionId
      ? { ...s, status: decision, reviewedAt: new Date().toISOString(), feedback: feedback || (decision === 'Accepted' ? 'Solution accepted. Escrow released.' : 'Does not meet acceptance criteria.') }
      : s
    ));

    if (decision === 'Accepted') {
      try { confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } }); } catch {}

      setChallenges(prev => prev.map(c => c.id === sub.challengeId ? { ...c, status: 'Solved', escrowStatus: 'Released' } : c));

      const releaseTxn: EscrowTransaction = {
        id: `TXN_REL_${Date.now()}`,
        challengeId: sub.challengeId,
        challengeTitle: sub.challengeTitle,
        amount: reward,
        platformFee,
        winnerPayout,
        othersPayout,
        type: 'Release',
        status: 'Completed',
        timestamp: new Date().toISOString(),
        txnRef: `REL_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      };
      setEscrowTransactions(prev => [releaseTxn, ...prev]);

      if (sub.leadStudentId === studentUser.id) {
        setStudentUser(prev => ({
          ...prev,
          walletBalance: (prev.walletBalance || 0) + winnerPayout,
          totalEarned: (prev.totalEarned || 0) + winnerPayout,
          solvedCount: (prev.solvedCount || 0) + 1,
          rating: (prev.rating || 1500) + 20,
        }));
      }
      showToast(`Solution accepted! ₹${winnerPayout.toLocaleString('en-IN')} released to ${sub.leadStudentName}'s wallet!`);
    } else {
      showToast('Submission rejected.', 'warning');
    }
  };

  const markHireInterested = (sub: Submission, roleOffered: string, compensationRange: string, notes: string) => {
    const hire: HireInterest = {
      id: `hire_${Date.now()}`,
      orgId: currentUser.id,
      studentId: sub.leadStudentId,
      studentName: sub.leadStudentName,
      studentAvatar: sub.leadStudentAvatar,
      studentCollege: sub.leadStudentCollege,
      studentEmail: `${sub.leadStudentName.toLowerCase().replace(' ', '.')}@example.ac.in`,
      challengeId: sub.challengeId,
      challengeTitle: sub.challengeTitle,
      status: 'Shortlisted',
      roleOffered: roleOffered || 'Product Engineer',
      compensationRange: compensationRange || '₹18 – 24 LPA',
      notes: notes || 'Exceptional solution demonstrated in challenge.',
      updatedAt: new Date().toISOString(),
    };
    setHireInterests(prev => [hire, ...prev]);
    showToast(`${sub.leadStudentName} added to hiring pipeline!`);
  };

  const updateHireStatus = (hireId: string, status: HireStatus) => {
    setHireInterests(prev => prev.map(h => h.id === hireId ? { ...h, status, updatedAt: new Date().toISOString() } : h));
    showToast(`Candidate status updated to: ${status}`, 'info');
  };

  const resolveDispute = (disputeId: string, resolution: 'Resolved - Student Paid' | 'Resolved - Org Refunded', adminNotes: string) => {
    setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: resolution, resolvedAt: new Date().toISOString(), adminNotes } : d));
    showToast(`Dispute resolved: ${resolution}`);
  };

  const withdrawWallet = (amount: number, upi: string): boolean => {
    if (amount <= 0 || amount > (studentUser.walletBalance || 0)) {
      showToast('Insufficient balance or invalid amount.', 'warning');
      return false;
    }
    setStudentUser(prev => ({ ...prev, walletBalance: (prev.walletBalance || 0) - amount }));
    showToast(`₹${amount.toLocaleString('en-IN')} withdrawal to ${upi} initiated!`);
    return true;
  };

  return (
    <AppContext.Provider value={{
      role, currentUser, switchRole, activeTab, setActiveTab,
      challenges, submissions, escrowTransactions, hireInterests, disputes,
      selectedChallenge, setSelectedChallenge,
      isPostModalOpen, setIsPostModalOpen,
      isSubmitModalOpen, setIsSubmitModalOpen,
      postChallenge, submitSolution, reviewSubmission,
      markHireInterested, updateHireStatus, resolveDispute, withdrawWallet,
      toastMessage, showToast, toastType,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
