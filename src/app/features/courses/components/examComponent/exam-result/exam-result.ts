import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ExamStateService } from '../../../../../core/service/exam-state.service';
import { ExamResultData } from '../../../../../core/models/exam.model';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-exam-result',
  imports: [NgClass, NgStyle],
  templateUrl: './exam-result.html',
  styleUrl: './exam-result.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen pt-12 pb-24',
  },
})
export class ExamResultComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly examState = inject(ExamStateService);

  readonly courseId = signal<number>(0);
  readonly result = signal<ExamResultData | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal<string | null>(null);

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/courses']);
      return;
    }

    this.courseId.set(id);
    this.loadResult();
  }

  loadResult(): void {
    const enrollmentId = this.examState.getStoredEnrollmentId() || this.courseId();

    if (!enrollmentId) {
      this.isLoading.set(false);
      this.loadError.set('Enrollment ID not found. Please restart the exam flow.');
      return;
    }

    this.isLoading.set(true);
    this.loadError.set(null);

    this.examState.getExamResult(enrollmentId).subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.isLoading.set(false);
        this.examState.clearSession(this.courseId());
        this.examState.clearEnrollmentId();
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        if (error instanceof HttpErrorResponse) {
          const apiError = error.error as { message?: string };
          this.loadError.set(apiError?.message || 'Failed to load exam result.');
        } else {
          this.loadError.set('An unexpected error occurred.');
        }
      },
    });
  }

  retryLoad(): void {
    this.loadResult();
  }

  goToMyExams(): void {
    this.router.navigate(['/profile'], { queryParams: { tab: 'exams' } });
  }
}
