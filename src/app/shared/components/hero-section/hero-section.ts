import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ExamRegister } from '../exam-register/exam-register';
import { ExamStateService } from '../../../core/service/exam-state.service';
import { AuthDialogService } from '../../../core/service/auth-dialog.service';
import {
  ExamEnrollService,
  ExamDetails,
  EnrollmentStatusData,
} from '../../../core/service/exam-enroll.service';
import { ExamStatus } from '../../../core/models/exam.model';

export interface HeroCta {
  label: string;
  icon?: string;
  type: 'primary' | 'outline';
  link?: string;
}

export interface HeroSectionData {
  title: string;
  subtitle: string;
  description: string;
  ctas: HeroCta[];
}

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, ExamRegister, RouterLink],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly examState = inject(ExamStateService);
  private readonly authDialog = inject(AuthDialogService);
  private readonly examEnrollService = inject(ExamEnrollService);

  data = input<HeroSectionData>();
  authService = inject(AuthService);

  // UI state signals
  isExamEnrollOpen = signal(false);
  isRegisteredForExam = signal(false);
  isCheckingEnrollment = signal(true);
  enrollmentStatus = signal<ExamStatus | null>(null);
  enrollmentStatusLabel = signal<string>('');
  enrollmentId = signal<number | null>(null);

  // Dynamic exam info from API
  dynamicExamId = signal<number | null>(null);
  dynamicExamTitle = signal<string>('');

  // ─── Exam schedule / availability signals ───────────────────
  examName = signal<string>('');
  examDetails = signal<ExamDetails | null>(null);
  examInstructions = signal<string>('');
  canStartExam = signal<boolean>(false);
  startUrl = signal<string>('');

  ExamStatus = ExamStatus;

  // ─── Storage key ──────────────────────────────────────────────
  private readonly STORAGE_KEY = 'exam_enrollment_id';
  private availabilityTimerId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Load exam list for the enrollment modal
    this.examEnrollService.getExamsList().subscribe((res) => {
      if (res.success && res.data?.length) {
        const toefl = res.data.find((e) => e.name.toLowerCase().includes('toefl')) || res.data[0];
        this.dynamicExamId.set(toefl.id);
        this.dynamicExamTitle.set(toefl.name);
      }
    });

    // Restore state on application load / after login
    if (!this.authService.isAuthenticated()) {
      this.isCheckingEnrollment.set(false);
      return;
    }

    const storedId = localStorage.getItem(this.STORAGE_KEY);
    if (storedId) {
      this.enrollmentId.set(Number(storedId));
      this.isRegisteredForExam.set(true);
      this.checkStatus(Number(storedId));
    } else {
      this.isCheckingEnrollment.set(false);
    }
  }

  ngOnDestroy(): void {
    this.clearAvailabilityTimer();
  }

  // ─── Enrollment Status Check ────────────────────────────────────────────────

  private checkStatus(enrollmentId: number): void {
    this.examEnrollService.checkEnrollmentStatus(enrollmentId).subscribe({
      next: (res) => {
        this.isCheckingEnrollment.set(false);

        if (res.success && res.data) {
          const d = res.data;
          const status = d.status as ExamStatus;
          const label = d.status_label || '';

          this.enrollmentStatus.set(status);
          this.enrollmentStatusLabel.set(label);

          // Store exam schedule details for the approved state
          this.examName.set(d.exam_name || '');
          this.examDetails.set(d.exam_details || null);
          this.examInstructions.set(d.instructions || '');
          this.canStartExam.set(!!d.can_start);
          this.startUrl.set(d.start_url || '');

          if (status === ExamStatus.COMPLETED) {
            this.examState.invalidateEnrollment(enrollmentId);
            this.clearEnrollment(true);
            return;
          }

          this.isRegisteredForExam.set(true);
          this.examState.restoreEnrollmentIdFromSession(enrollmentId);

          // If approved but can't start yet, set up a timer to re-check
          if (status === ExamStatus.APPROVED && !d.can_start) {
            this.startAvailabilityTimer(enrollmentId);
          }
          return;
        }

        // API returned success: false → enrollment is invalid, clear storage
        this.clearEnrollment(true);
      },
      error: (err: unknown) => {
        this.isCheckingEnrollment.set(false);

        // Critical 4xx errors (invalid/expired/unauthorized) → clear storage
        if (err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500) {
          this.clearEnrollment(true);
          return;
        }

        // Temporary errors (5xx, network) → keep enrollment ID in storage, only reset UI
        this.clearEnrollment(false);
      },
    });
  }

  // ─── Availability Timer ─────────────────────────────────────────────────────

  /**
   * Every 30 seconds, re-check enrollment status to detect when
   * `can_start` becomes true (i.e. exam time has arrived).
   */
  private startAvailabilityTimer(enrollmentId: number): void {
    this.clearAvailabilityTimer();
    this.availabilityTimerId = setInterval(() => {
      this.examEnrollService.checkEnrollmentStatus(enrollmentId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.canStartExam.set(!!res.data.can_start);
            this.startUrl.set(res.data.start_url || '');
            if (res.data.can_start) {
              this.clearAvailabilityTimer();
            }
          }
        },
      });
    }, 30_000);
  }

  private clearAvailabilityTimer(): void {
    if (this.availabilityTimerId !== null) {
      clearInterval(this.availabilityTimerId);
      this.availabilityTimerId = null;
    }
  }

  // ─── Enrollment Handler ─────────────────────────────────────────────────────

  onExamEnrolled(data?: any): void {
    const enrollId = data?.enrollment_id || data?.data?.enrollment_id;

    if (enrollId) {
      const status = (data?.status || data?.data?.status || 'pending') as ExamStatus;
      const label = data?.status_label || data?.data?.status_label || '';

      localStorage.setItem(this.STORAGE_KEY, enrollId.toString());

      this.enrollmentId.set(Number(enrollId));
      this.enrollmentStatus.set(status);
      this.enrollmentStatusLabel.set(label);
      this.isRegisteredForExam.set(true);

      // Re-fetch status to get full exam_details
      this.checkStatus(Number(enrollId));
    }
  }

  // ─── CTA Click Handlers ─────────────────────────────────────────────────────

  onPrimaryExamCtaClick(): void {
    if (this.isCheckingEnrollment()) return;

    if (!this.authService.isAuthenticated()) {
      this.authDialog.openLogin();
      return;
    }

    const storedId = localStorage.getItem(this.STORAGE_KEY);
    if (storedId) {
      this.enrollmentId.set(Number(storedId));
      this.isCheckingEnrollment.set(true);
      this.checkStatus(Number(storedId));
      return;
    }

    this.openExamEnroll();
  }

  goToExam(): void {
    if (this.enrollmentStatus() === ExamStatus.PENDING) return;

    if (this.enrollmentStatus() === ExamStatus.REJECTED) {
      this.openExamEnroll();
      return;
    }

    const enrollId = this.enrollmentId();
    if (!enrollId) {
      this.openExamEnroll();
      return;
    }

    // If can_start is true, use start_url (which uses enrollment_id)
    const url = this.startUrl();
    if (url) {
      window.open(url, '_blank');
      return;
    }

    // Fallback to in-app exam route
    this.examState.initSession(enrollId);
    this.router.navigate(['/courses', enrollId, 'exam']);
  }

  openExamEnroll(): void {
    this.isExamEnrollOpen.set(true);
  }

  closeExamEnroll(): void {
    this.isExamEnrollOpen.set(false);
  }

  private clearEnrollment(removeFromStorage: boolean): void {
    if (removeFromStorage) {
      this.examState.invalidateEnrollment(this.enrollmentId() ?? undefined);
    }
    // Always reset UI signals
    this.enrollmentId.set(null);
    this.enrollmentStatus.set(null);
    this.enrollmentStatusLabel.set('');
    this.isRegisteredForExam.set(false);
    this.examName.set('');
    this.examDetails.set(null);
    this.examInstructions.set('');
    this.canStartExam.set(false);
    this.startUrl.set('');
    this.clearAvailabilityTimer();
  }
}
