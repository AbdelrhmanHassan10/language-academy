import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamStateService } from '../../../../../core/service/exam-state.service';
import { Confirmation } from '../../../../../shared/components/confirmation/confirmation';
import { LevelOne } from '../level-one/level-one';
import { LevelTwo } from '../level-two/level-two';
import { LevelThree } from '../level-three/level-three';
import { ExamLevel, ExamLevelData } from '../../../../../core/models/exam.model';

@Component({
  selector: 'app-exam-container',
  imports: [Confirmation, LevelOne, LevelTwo, LevelThree, DatePipe],
  templateUrl: './exam-container.html',
  styleUrl: './exam-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
    '(window:beforeunload)': 'onBeforeUnload($event)',
  },
})
export class ExamContainer implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly examState = inject(ExamStateService);

  readonly showSubmitModal = signal(false);
  readonly isSubmitting = signal(false);
  readonly isSavingSection = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly courseId = computed(() => +this.route.snapshot.paramMap.get('id')!);

  readonly currentLevel = this.examState.currentLevel;

  readonly levelSteps = computed<{ level: ExamLevel; label: string; title: string }[]>(() => {
    const levels = this.examState.examData()?.levels ?? [];

    if (levels.length > 0) {
      return levels.map((level: ExamLevelData) => ({
        level: level.level,
        label: `Level ${level.level}`,
        title: level.shortTitle,
      }));
    }

    return [
      { level: 1, label: 'Level 1', title: 'Section 1' },
      { level: 2, label: 'Level 2', title: 'Section 2' },
      { level: 3, label: 'Level 3', title: 'Section 3' },
    ];
  });

  readonly answeredCountForLevel = (level: ExamLevel) =>
    computed(() => this.examState.getAnswersForLevel(level).length);

  ngOnInit(): void {
    const courseId = this.courseId();

    // Safety check: Ensure session exists (Guard should have handled this, but let's be double sure)
    if (!this.examState.hasActiveSession(courseId)) {
      this.router.navigate(['/courses', courseId]);
      return;
    }

    this.examState.initSession(courseId);
    this.examState.restoreEnrollmentIdFromSession(courseId);

    this.examState.loadExamData(courseId).subscribe({
      next: (data) => {
        if (data.status === 'completed') {
          this.examState.clearSession(courseId);
          this.router.navigate(['/courses', courseId, 'exam-result']);
        }
      },
      error: (err: unknown) => {
        // Critical 4xx errors (session expired, unauthorized, not found)
        // → clear enrollment ID and redirect user out of the exam
        if (err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500) {
          this.examState.invalidateEnrollment(courseId);
          this.router.navigate(['/home']);
        }
        // 5xx / network errors → keep enrollment ID in storage (handled by shared state)
      },
    });
  }

  retryLoad(): void {
    this.examState.loadExamData(this.courseId()).subscribe();
  }

  /** Intercept browser refresh / tab close to warn the user. */
  onBeforeUnload(event: BeforeUnloadEvent): void {
    const session = this.examState.session();
    // Don't warn if the whole exam is submitted or all levels are submitted
    if (
      !session ||
      session.submitted ||
      session.submittedLevels.length === (this.examState.examData()?.levels.length || 3)
    ) {
      return;
    }
    if (this.examState.hasUnsavedProgress()) {
      event.preventDefault();
    }
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  goNextLevel(): void {
    const currentLevel = this.currentLevel();
    this.isSavingSection.set(true);
    this.submitError.set(null);

    this.examState.submitSection(this.courseId(), currentLevel).subscribe({
      next: () => {
        this.isSavingSection.set(false);
        this.examState.nextLevel();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.isSavingSection.set(false);
        this.submitError.set(this.getApiErrorMessage(error));
        this.examState.nextLevel();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }

  goPrevLevel(): void {
    this.examState.prevLevel();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Submit Flow ─────────────────────────────────────────────────────────────

  openSubmitModal(): void {
    const currentLevel = this.currentLevel();
    this.isSavingSection.set(true);
    this.submitError.set(null);

    this.examState.submitSection(this.courseId(), currentLevel).subscribe({
      next: () => {
        this.isSavingSection.set(false);
        this.examState.markCompleted();
        this.showSubmitModal.set(true);
      },
      error: (error) => {
        this.isSavingSection.set(false);
        this.submitError.set(this.getApiErrorMessage(error));
      },
    });
  }

  onSubmitConfirm(): void {
    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.examState.submitExam(this.courseId()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSubmitModal.set(false);
        window.scrollTo(0, 0);
        this.router.navigate(['/courses', this.courseId(), 'exam-result']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.submitError.set(this.getApiErrorMessage(error));
      },
    });
  }

  onSubmitCancel(): void {
    this.showSubmitModal.set(false);
  }

  private getApiErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiError = error.error as
        | { message?: string; errors?: Record<string, unknown> }
        | undefined;

      if (apiError?.message) {
        return apiError.message;
      }
    }

    return 'Submission failed. Your answers are saved locally. Please try again.';
  }
}
