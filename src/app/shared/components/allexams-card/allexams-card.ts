import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../core/service/exam.service';
import { ExamListItem, ExamStatus } from '../../../core/models/exam.model';
import { ExamRegister } from '../exam-register/exam-register';
import { AuthService } from '../../../core/service/auth.service';
import { AuthDialogService } from '../../../core/service/auth-dialog.service';
import { ExamEnrollService } from '../../../core/service/exam-enroll.service';
import { ExamStateService } from '../../../core/service/exam-state.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-allexams-card',
  imports: [CommonModule, ExamRegister],
  templateUrl: './allexams-card.html',
  styleUrl: './allexams-card.scss',
})
export class AllexamsCard implements OnInit {
  private examService = inject(ExamService);
  private authService = inject(AuthService);
  private authDialog = inject(AuthDialogService);
  private examEnrollService = inject(ExamEnrollService);
  private examState = inject(ExamStateService);

  search = input<string>('');

  // ── Exam list ─────────────────────────────────────────────────────────
  allExams = signal<ExamListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  filteredExams = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.allExams();
    return this.allExams().filter((e) => e.name.toLowerCase().includes(term));
  });

  // ── Modal state ───────────────────────────────────────────────────────
  isExamEnrollOpen = signal(false);
  selectedExamId = signal<number>(1); // default 1 — never null
  selectedExamTitle = signal<string>('');

  // ── Enrollment state ──────────────────────────────────────────────────
  isRegisteredForExam = signal(false);
  isCheckingEnrollment = signal(false);
  enrollmentStatus = signal<ExamStatus | null>(null);
  enrollmentStatusLabel = signal<string>('');
  enrollmentId = signal<number | null>(null);

  private readonly STORAGE_KEY = 'exam_enrollment_id';

  ExamStatus = ExamStatus;

  ngOnInit(): void {
    this.loadExams();

    // Restore enrollment if user already enrolled
    if (!this.authService.isAuthenticated()) return;

    const storedId = localStorage.getItem(this.STORAGE_KEY);
    if (storedId) {
      this.enrollmentId.set(Number(storedId));
      this.isRegisteredForExam.set(true);
      this.checkEnrollmentStatus(Number(storedId));
    }
  }

  // ── Load exams ────────────────────────────────────────────────────────
  loadExams(): void {
    this.loading.set(true);
    this.error.set(null);

    this.examService.getExams().subscribe({
      next: (res) => {
        this.allExams.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('حدث خطأ أثناء تحميل الامتحانات');
        this.loading.set(false);
      },
    });
  }

  // ── Check enrollment status ───────────────────────────────────────────
  private checkEnrollmentStatus(enrollmentId: number): void {
    this.isCheckingEnrollment.set(true);

    this.examEnrollService.checkEnrollmentStatus(enrollmentId).subscribe({
      next: (res) => {
        this.isCheckingEnrollment.set(false);
        if (res.success && res.data) {
          this.enrollmentStatus.set(res.data.status as ExamStatus);
          this.enrollmentStatusLabel.set(res.data.status_label || '');
          this.isRegisteredForExam.set(true);
        } else {
          this.clearEnrollment();
        }
      },
      error: (err: unknown) => {
        this.isCheckingEnrollment.set(false);
        if (err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500) {
          this.clearEnrollment();
        }
      },
    });
  }

  // ── Card click ────────────────────────────────────────────────────────
  onExamCardClick(exam: ExamListItem): void {
    // Not logged in → open login dialog
    if (!this.authService.isAuthenticated()) {
      this.authDialog.openLogin();
      return;
    }

    // Already enrolled → just re-check status, don't open modal
    const storedId = localStorage.getItem(this.STORAGE_KEY);
    if (storedId) {
      this.checkEnrollmentStatus(Number(storedId));
      return;
    }

    // Set selected exam then open modal
    this.selectedExamId.set(exam.id);
    this.selectedExamTitle.set(exam.name);
    this.isExamEnrollOpen.set(true);
  }

  // ── After enrollment ──────────────────────────────────────────────────
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
      this.examState.restoreEnrollmentIdFromSession(Number(enrollId));
    }

    this.isExamEnrollOpen.set(false);
  }

  // ── Close modal ───────────────────────────────────────────────────────
  closeExamEnroll(): void {
    this.isExamEnrollOpen.set(false);
  }

  // ── Clear enrollment ──────────────────────────────────────────────────
  private clearEnrollment(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.enrollmentId.set(null);
    this.enrollmentStatus.set(null);
    this.enrollmentStatusLabel.set('');
    this.isRegisteredForExam.set(false);
  }
}
