export type UserRole = 'student' | 'company' | 'government' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  verified: boolean;
  // Student specific
  college?: string;
  graduationYear?: number;
  skills?: string[];
  githubUrl?: string;
  portfolioUrl?: string;
  solvedCount?: number;
  rating?: number;
  walletBalance?: number;
  totalEarned?: number;
  badges?: string[];
  // Company / Govt specific
  orgName?: string;
  orgLogo?: string;
  orgType?: 'startup' | 'company' | 'government' | 'ngo';
  orgDomain?: string;
  gstin?: string;
  escrowBalance?: number;
  totalChallengesPosted?: number;
}

export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type ChallengeStatus = 'Open' | 'In Progress' | 'Under Review' | 'Solved' | 'Closed';
export type EscrowStatus = 'Funded' | 'Released' | 'Refunded';
export type ChallengeTrack = 'Public' | 'Private';
export type ChallengeSector =
  | 'Water & Sanitation'
  | 'Healthcare'
  | 'Agriculture'
  | 'Education'
  | 'Infrastructure'
  | 'Environment'
  | 'Fintech'
  | 'Governance'
  | 'Smart Cities'
  | 'Other';

export interface Challenge {
  id: string;
  posterId: string;
  posterName: string;
  posterLogo: string;
  posterType: 'government' | 'startup' | 'company' | 'ngo';
  track: ChallengeTrack;
  title: string;
  description: string;
  sector: ChallengeSector;
  tags: string[];
  difficulty: ChallengeDifficulty;
  rewardAmount: number;
  rewardType: 'cash' | 'certificate' | 'hybrid';
  escrowStatus: EscrowStatus;
  escrowTxnId: string;
  deadline: string;
  createdAt: string;
  locationScope: 'National' | 'State';
  locationState?: string;
  status: ChallengeStatus;
  submissionsCount: number;
  teamsCount: number;
  maxTeams?: number;
  requiresDevType: 'web' | 'mobile' | 'iot' | 'any';
  acceptanceCriteria: string[];
  problemStatement?: string;
  expectedOutcome?: string;
  rewardSplit?: {
    winner: number;
    others: number;
  };
}

export type SubmissionStatus = 'Pending Review' | 'Accepted' | 'Rejected' | 'Disputed';

export interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  teamName: string;
  leadStudentId: string;
  leadStudentName: string;
  leadStudentAvatar: string;
  leadStudentCollege: string;
  leadStudentRating: number;
  memberCount: number;
  githubUrl: string;
  prUrl?: string;
  writeup: string;
  demoUrl?: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
  plagiarismScore: number;
  plagiarismFlagged: boolean;
  milestones?: { title: string; completed: boolean }[];
}

export interface EscrowTransaction {
  id: string;
  challengeId: string;
  challengeTitle: string;
  amount: number;
  platformFee: number;
  winnerPayout: number;
  othersPayout: number;
  type: 'Deposit' | 'Release' | 'Refund';
  status: 'Completed' | 'Pending' | 'Locked in Escrow';
  timestamp: string;
  txnRef: string;
}

export type HireStatus = 'Shortlisted' | 'Interview Scheduled' | 'Offer Extended' | 'Placed';

export interface HireInterest {
  id: string;
  orgId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentCollege: string;
  studentEmail: string;
  challengeId: string;
  challengeTitle: string;
  status: HireStatus;
  roleOffered: string;
  compensationRange: string;
  notes: string;
  updatedAt: string;
}

export interface Dispute {
  id: string;
  submissionId: string;
  challengeId: string;
  challengeTitle: string;
  studentName: string;
  orgName: string;
  reason: string;
  evidence: string;
  status: 'Open' | 'Under Investigation' | 'Resolved - Student Paid' | 'Resolved - Org Refunded';
  raisedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}
