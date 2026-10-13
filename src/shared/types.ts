export type ScreeningTopic =
  | "stress"
  | "depression"
  | "anxiety"
  | "focus"
  | "hyperactivity"
  | "social"
  | "study"
  | "career";

export type SeverityLevel =
  | "normal"
  | "mild"
  | "moderate"
  | "severe"
  | "extremely_severe";

export type UserRole = "student" | "counselor" | "admin";

export type LetterStatus = "pending" | "answered" | "flagged_urgent";

export type AppointmentFormat = "offline_school" | "online_meet";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface QuestionOption {
  label: string;
  value: number; // 0, 1, 2, 3
}

export interface ScreeningQuestion {
  id: string;
  topic: ScreeningTopic;
  text: string;
  redFlag?: boolean;
}

export interface ScreeningTopicMeta {
  id: ScreeningTopic;
  title: string;
  description: string;
  icon: string; // name for Lucide icon
}

export interface ScreeningAnswer {
  questionId: string;
  score: number;
}

export interface TopicResult {
  topic: ScreeningTopic;
  score: number;
  maxScore: number;
  severity: SeverityLevel;
  isHighRisk: boolean;
  redFlagsTriggered: string[];
  recommendation: string;
}

export interface ScreeningEvaluationResult {
  overallSeverity: SeverityLevel;
  hasHighRisk: boolean;
  redFlagsCount: number;
  topicResults: TopicResult[];
  disclaimer: string;
}

export interface UserDTO {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  grade?: number | null;
  className?: string | null;
  createdAt: number;
}

export interface CounselingLetterDTO {
  id: string;
  trackingCode: string;
  studentId?: string | null;
  studentAlias?: string | null;
  title: string;
  content: string;
  category: string;
  status: LetterStatus;
  replyContent?: string | null;
  repliedBy?: string | null;
  repliedAt?: number | null;
  createdAt: number;
}

export interface AppointmentDTO {
  id: string;
  studentId?: string | null;
  studentName: string;
  contactInfo: string;
  counselorId?: string | null;
  appointmentDate: string;
  timeSlot: string;
  format: AppointmentFormat;
  status: AppointmentStatus;
  note?: string | null;
  createdAt: number;
}

export interface MentalResourceDTO {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  contentMarkdown: string;
  iconName: string;
  isPublished: boolean;
  createdAt: number;
}

export interface DashboardOverviewData {
  totalScreenings: number;
  highRiskCases: number;
  pendingLetters: number;
  todayAppointments: number;
  demoNote?: string;
}
