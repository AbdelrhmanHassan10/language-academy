import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import {
  ApiExamData,
  ApiExamResponse,
  ExamData,
  ExamAnswer,
  ExamAnswerValue,
  ExamSession,
  ExamLevel,
  SubmitExamPayload,
  SubmitExamResponse,
  SubmitSectionPayload,
  SubmitSectionResponse,
  ApiExamResultResponse,
} from '../models/exam.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExamStateService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly storagePrefix = 'exam_session_v2';
  private readonly enrollmentStorageKey = 'exam_enrollment_id';

  // Exam questions loaded from the API
  readonly examData = signal<ExamData | null>(null);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  // Session state – persisted to localStorage
  private readonly _session = signal<ExamSession | null>(null);
  readonly session = this._session.asReadonly();

  readonly currentLevel = computed<ExamLevel>(() => this._session()?.currentLevel ?? 1);
  readonly answers = computed(() => this._session()?.answers ?? []);
  readonly isCompleted = computed(() => this._session()?.completed ?? false);
  readonly isSubmitted = computed(() => this._session()?.submitted ?? false);
  readonly submittedLevels = computed(() => this._session()?.submittedLevels ?? []);

  /** True when answers exist but exam has not been submitted yet. */
  readonly hasUnsavedProgress = computed(
    () => !!this._session() && !this._session()!.submitted && this._session()!.answers.length > 0,
  );

  /** Returns a computed signal for the questions belonging to a given level. */
  questionsForLevel(level: ExamLevel) {
    return computed(() => {
      const data = this.examData();
      if (!data) return [];
      return data.levels.find((l) => l.level === level)?.questions ?? [];
    });
  }

  /** Returns a computed signal for the metadata (title, description) of a level. */
  levelInfo(level: ExamLevel) {
    return computed(() => {
      const data = this.examData();
      if (!data) return null;
      return data.levels.find((l) => l.level === level) ?? null;
    });
  }

  // ─── Session Lifecycle ─────────────────────────────────────────────────────

  /**
   * Start a new session for the given course, or resume the existing one if
   * it belongs to the same course and hasn't been submitted yet.
   */
  initSession(courseId: number): void {
    const inMemorySession = this._session();
    if (inMemorySession && inMemorySession.courseId === courseId && !inMemorySession.submitted) {
      return;
    }

    const storedSession = this.loadSessionFromStorage(courseId);
    if (storedSession && !storedSession.submitted) {
      this._session.set(storedSession);
      return;
    }

    const fresh: ExamSession = {
      courseId,
      currentLevel: 1,
      answers: [],
      submittedLevels: [],
      startedAt: new Date().toISOString(),
      completed: false,
      submitted: false,
    };
    this._session.set(fresh);
    this.persistSession(fresh);
  }

  /** Checks if a non-submitted session exists for the given course. */
  hasActiveSession(courseId: number): boolean {
    const inMemory = this._session();
    if (inMemory && inMemory.courseId === courseId && !inMemory.submitted) {
      return true;
    }

    const stored = this.loadSessionFromStorage(courseId);
    return !!stored && !stored.submitted;
  }

  // ─── Answer Management ─────────────────────────────────────────────────────

  /** Insert or update a single answer, then persist to localStorage. */
  upsertAnswer(answer: ExamAnswer): void {
    const session = this._session();
    if (!session) return;
    const answers = [...session.answers];
    const idx = answers.findIndex((a) => a.questionKey === answer.questionKey);
    if (idx >= 0) {
      answers[idx] = answer;
    } else {
      answers.push(answer);
    }
    const updated: ExamSession = { ...session, answers };
    this._session.set(updated);
    this.persistSession(updated);
  }

  /** Insert or update multiple answers at once, then persist. */
  upsertAnswers(newAnswers: ExamAnswer[]): void {
    const session = this._session();
    if (!session) return;
    const answers = [...session.answers];
    for (const answer of newAnswers) {
      const idx = answers.findIndex((a) => a.questionKey === answer.questionKey);
      if (idx >= 0) {
        answers[idx] = answer;
      } else {
        answers.push(answer);
      }
    }
    const updated: ExamSession = { ...session, answers };
    this._session.set(updated);
    this.persistSession(updated);
  }

  /** Returns the answers that belong to a specific level. */
  getAnswersForLevel(level: ExamLevel): ExamAnswer[] {
    const data = this.examData();
    if (!data) return [];
    const questionIds = new Set(
      data.levels.find((l) => l.level === level)?.questions.map((q) => q.id) ?? [],
    );
    return this.answers().filter((a) => questionIds.has(a.questionKey));
  }

  // ─── Level Navigation ──────────────────────────────────────────────────────

  goToLevel(level: ExamLevel): void {
    const session = this._session();
    if (!session || session.submittedLevels.includes(level)) return;
    const updated: ExamSession = { ...session, currentLevel: level };
    this._session.set(updated);
    this.persistSession(updated);
  }

  nextLevel(): void {
    const current = this.currentLevel();
    if (current < 3) this.goToLevel((current + 1) as ExamLevel);
  }

  prevLevel(): void {
    const current = this.currentLevel();
    if (current > 1) {
      const prev = (current - 1) as ExamLevel;
      const session = this._session();
      if (session && !session.submittedLevels.includes(prev)) {
        this.goToLevel(prev);
      }
    }
  }

  markCompleted(): void {
    const session = this._session();
    if (!session) return;
    const updated: ExamSession = { ...session, completed: true };
    this._session.set(updated);
    this.persistSession(updated);
  }

  // ─── API Calls ─────────────────────────────────────────────────────────────

  loadExamData(courseId: number): Observable<ExamData> {
    // Return cached data if available for the same course
    const currentData = this.examData();
    if (currentData && currentData.courseId === courseId) {
      return of(currentData);
    }

    this.isLoading.set(true);
    this.loadError.set(null);
    return this.http.get<ApiExamResponse>(`${environment.baseUrl}/student/exam/${courseId}`).pipe(
      map((res) => this.mapApiExamData(res.data)),
      tap((data) => {
        this.examData.set(data);
        this.hydrateAnswersFromServer(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.loadError.set('Failed to load exam. Please try again.');
        this.isLoading.set(false);
        return throwError(() => err);
      }),
    );
  }

  submitExam(courseId: number): Observable<SubmitExamResponse> {
    const payload: SubmitExamPayload = {
      exam_id: this.examData()?.examId || courseId,
      answers: this.answers().map((answer) => ({
        section_index: answer.sectionIndex,
        question_id: answer.questionId,
        question_index: answer.questionIndex,
        answer: answer.answer,
      })),
    };
    return this.http
      .post<SubmitExamResponse>(`${environment.baseUrl}/student/exam/${courseId}/submit`, payload)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.markSessionSubmitted();
            this.clearEnrollmentId();
          }
        }),
      );
  }

  submitSection(courseId: number, level: ExamLevel): Observable<SubmitSectionResponse> {
    const payload: SubmitSectionPayload = {
      exam_id: this.examData()?.examId || courseId,
      section_index: level - 1,
      answers: this.getAnswersForLevel(level).map((answer) => ({
        question_id: answer.questionId,
        question_index: answer.questionIndex,
        answer: answer.answer,
      })),
    };

    return this.http
      .post<SubmitSectionResponse>(
        `${environment.baseUrl}/student/exam/${courseId}/submit-section`,
        payload,
      )
      .pipe(
        tap((res) => {
          if (res.success) {
            const session = this._session();
            if (session && !session.submittedLevels.includes(level)) {
              const updated: ExamSession = {
                ...session,
                submittedLevels: [...session.submittedLevels, level],
              };
              this._session.set(updated);
              this.persistSession(updated);
            }
          }
        }),
      );
  }

  getExamResult(enrollmentId: number): Observable<ApiExamResultResponse> {
    return this.http
      .get<ApiExamResultResponse>(`${environment.baseUrl}/student/exam/${enrollmentId}/result`)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.markSessionSubmitted();
          }
        }),
      );
  }

  /** Remove session from memory and localStorage. */
  clearSession(courseId?: number): void {
    const resolvedCourseId = courseId ?? this._session()?.courseId;
    this._session.set(null);
    if (this.isBrowser && resolvedCourseId !== undefined) {
      localStorage.removeItem(this.storageKey(resolvedCourseId));
    }
  }

  clearEnrollmentId(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.enrollmentStorageKey);
  }

  invalidateEnrollment(courseId?: number): void {
    this.clearEnrollmentId();
    this.clearSession(courseId);
    this.examData.set(null);
  }

  syncEnrollmentId(enrollmentId?: number | null): void {
    if (!this.isBrowser || !enrollmentId) return;
    localStorage.setItem(this.enrollmentStorageKey, String(enrollmentId));
  }

  restoreEnrollmentIdFromSession(courseId?: number): void {
    if (!this.isBrowser) return;

    const session = courseId ? this.loadSessionFromStorage(courseId) : this._session();
    const enrollmentId = this.examData()?.enrollmentId ?? session?.courseId;

    if (!session?.submitted && enrollmentId) {
      localStorage.setItem(this.enrollmentStorageKey, String(enrollmentId));
    }
  }

  getStoredEnrollmentId(): number | null {
    if (!this.isBrowser) return null;

    const enrollmentId = localStorage.getItem(this.enrollmentStorageKey);
    const parsedEnrollmentId = enrollmentId ? Number(enrollmentId) : NaN;

    return Number.isFinite(parsedEnrollmentId) && parsedEnrollmentId > 0
      ? parsedEnrollmentId
      : null;
  }

  // ─── Storage Helpers ───────────────────────────────────────────────────────

  private loadSessionFromStorage(courseId: number): ExamSession | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(this.storageKey(courseId));
      return raw ? (JSON.parse(raw) as ExamSession) : null;
    } catch {
      return null;
    }
  }

  private persistSession(session: ExamSession): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.storageKey(session.courseId), JSON.stringify(session));
    } catch (e) {
      console.warn('Could not persist exam session to localStorage', e);
    }
  }

  private storageKey(courseId: number): string {
    return `${this.storagePrefix}:${courseId}`;
  }

  private mapApiExamData(data: ApiExamData): ExamData {
    return {
      courseId: data.enrollment_id || data.id,
      enrollmentId: data.enrollment_id,
      examId: data.id,
      title: data.name,
      description: data.description,
      durationMinutes: data.duration_minutes,
      totalQuestions: data.total_questions,
      answeredQuestions: data.answered_questions,
      status: data.status as any,
      statusLabel: data.status_label,
      levels: data.sections.map((section, index) => {
        const level = (index + 1) as ExamLevel;

        return {
          level,
          title: `Level ${level} - ${section.type_arabic || this.toTitleCase(section.type)}`,
          description: section.instructions,
          shortTitle: section.type_arabic || this.toTitleCase(section.type),
          sectionType: section.type,
          sectionTypeArabic: section.type_arabic,
          timeMinutes: section.time_minutes,
          instructions: section.instructions,
          passage: section.passage,
          audioUrl: section.audio_file,
          totalQuestions: section.total_questions,
          answeredCount: section.answered_count,
          progressPercentage: section.progress_percentage,
          questions: section.questions.map((question, qIndex) => ({
            id: this.questionKey(section.section_index, question.question_id),
            questionId: question.question_id,
            questionIndex: qIndex,
            levelNumber: level,
            sectionIndex: section.section_index,
            questionText: question.text,
            type: question.options && Object.keys(question.options).length > 0 ? 'radio' : 'text',
            options: question.options
              ? Object.entries(question.options).map(([id, text], index) => {
                  const finalId = !isNaN(Number(id)) ? String.fromCharCode(65 + index) : id;
                  return { id: finalId, text: text as string };
                })
              : undefined,
            points: question.points,
            userAnswer: question.user_answer,
            isAnswered: question.is_answered,
            isCorrect: question.is_correct,
          })),
        };
      }),
    };
  }

  private hydrateAnswersFromServer(data: ExamData): void {
    this.syncEnrollmentId(data.enrollmentId ?? data.courseId);

    if (data.status === 'completed') {
      this.markSessionSubmitted();
      this.clearEnrollmentId();
      return;
    }

    const session = this._session();
    if (!session || session.courseId !== data.courseId) return;

    const localAnswers = [...session.answers];
    const localKeys = new Set(localAnswers.map((answer) => answer.questionKey));

    const serverAnswers: ExamAnswer[] = data.levels.flatMap((level) =>
      level.questions
        .filter(
          (question) =>
            question.isAnswered &&
            question.userAnswer !== null &&
            question.userAnswer !== undefined,
        )
        .map((question) => ({
          questionKey: question.id,
          questionId: question.questionId,
          questionIndex: question.questionIndex,
          sectionIndex: question.sectionIndex,
          answer: String(question.userAnswer),
        }))
        .filter((answer) => !localKeys.has(answer.questionKey)),
    );

    // Identify levels that have answers on the server (i.e. already submitted)
    const serverSubmittedLevels = data.levels
      .filter((level) => level.answeredCount > 0)
      .map((level) => level.level);

    const mergedSubmittedLevels = Array.from(
      new Set([...session.submittedLevels, ...serverSubmittedLevels]),
    );

    let newCurrentLevel = session.currentLevel;
    // Push the user to the first unsubmitted level, or last level if all submitted
    if (serverSubmittedLevels.length > 0) {
      const firstUnfinished = data.levels.find(
        (l) => !mergedSubmittedLevels.includes(l.level),
      )?.level;
      newCurrentLevel = firstUnfinished || (data.levels.length as ExamLevel);
    }

    if (
      serverAnswers.length === 0 &&
      mergedSubmittedLevels.length === session.submittedLevels.length &&
      newCurrentLevel === session.currentLevel
    ) {
      return;
    }

    const updated: ExamSession = {
      ...session,
      currentLevel: newCurrentLevel,
      answers: [...localAnswers, ...serverAnswers],
      submittedLevels: mergedSubmittedLevels,
    };

    this._session.set(updated);
    this.persistSession(updated);
  }

  private markSessionSubmitted(): void {
    const session = this._session();
    if (!session) return;

    const updated: ExamSession = {
      ...session,
      submitted: true,
      completed: true,
    };

    this._session.set(updated);
    this.persistSession(updated);
  }

  private questionKey(sectionIndex: number, questionId: number): string {
    return `section-${sectionIndex}-question-${questionId}`;
  }

  private toTitleCase(value: string): string {
    return value
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
