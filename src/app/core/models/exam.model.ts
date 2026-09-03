export type QuestionType = 'radio' | 'checkbox' | 'text';
export type ExamLevel = 1 | 2 | 3;
export type ExamAnswerValue = string | string[];
export enum ExamStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  questionId: number;
  questionIndex: number;
  levelNumber: ExamLevel;
  sectionIndex: number;
  questionText: string;
  type: QuestionType;
  options?: ExamOption[];
  points: number;
  userAnswer?: ExamAnswerValue | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
}

export interface ExamAnswer {
  questionKey: string;
  questionId: number;
  questionIndex: number;
  sectionIndex: number;
  answer: ExamAnswerValue;
}

export interface ExamSession {
  courseId: number;
  currentLevel: ExamLevel;
  answers: ExamAnswer[];
  submittedLevels: number[];
  startedAt: string;
  completed: boolean;
  submitted: boolean;
}

export interface ExamLevelData {
  level: ExamLevel;
  title: string;
  description: string;
  shortTitle: string;
  sectionType: string;
  sectionTypeArabic: string;
  timeMinutes: number;
  instructions: string;
  passage: string | null;
  audioUrl: string | null;
  totalQuestions: number;
  answeredCount: number;
  progressPercentage: number;
  questions: ExamQuestion[];
}

export interface ExamData {
  courseId: number;
  enrollmentId?: number;
  examId?: number;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  answeredQuestions: number;
  levels: ExamLevelData[];
  status?: ExamStatus;
  statusLabel?: string;
}

export interface SubmitExamPayload {
  exam_id: number;
  answers: Array<{
    section_index: number;
    question_id: number;
    question_index: number;
    answer: ExamAnswerValue;
  }>;
}

export interface SubmitExamResponse {
  success: boolean;
  message: string;
  data?: {
    score: number;
    totalQuestions: number;
    passed: boolean;
  };
}

export interface SubmitSectionPayload {
  exam_id: number;
  section_index: number;
  answers: Array<{
    question_id: number;
    question_index: number;
    answer: ExamAnswerValue;
  }>;
}

export interface SubmitSectionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface ApiExamQuestion {
  id: number;
  question_id: number;
  text: string;
  options: Record<string, string> | null;
  points: number;
  user_answer: ExamAnswerValue | null;
  is_answered: boolean;
  is_correct: boolean | null;
}

export interface ApiExamSection {
  section_index: number;
  type: string;
  type_arabic: string;
  time_minutes: number;
  instructions: string;
  passage: string | null;
  audio_file: string | null;
  questions: ApiExamQuestion[];
  total_questions: number;
  answered_count: number;
  progress_percentage: number;
}

export interface ApiExamData {
  id: number;
  enrollment_id?: number;
  name: string;
  description: string;
  duration_minutes: number;
  sections: ApiExamSection[];
  total_questions: number;
  answered_questions: number;
  status?: ExamStatus;
  status_label?: string;
}

export interface ApiExamResponse {
  success: boolean;
  message: string;
  data: ApiExamData;
}

export interface ExamResultQuestion {
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points: number;
  max_points: number;
}

export interface ExamResultSection {
  section_type: string;
  section_type_arabic: string;
  score: number;
  max_score: number;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  percentage: number;
  questions: ExamResultQuestion[];
}

export interface ExamResultData {
  exam_name: string;
  completed_at: string;
  total_score: number;
  max_score: number;
  percentage: number;
  grade: string;
  sections: ExamResultSection[];
}

export interface ApiExamResultResponse {
  success: boolean;
  message: string;
  data: ExamResultData;
}
export interface ExamListItem {
    id:   number;
    name: string;
}

export interface ExamListResponse {
    success: boolean;
    message: string;
    data:    ExamListItem[];
}