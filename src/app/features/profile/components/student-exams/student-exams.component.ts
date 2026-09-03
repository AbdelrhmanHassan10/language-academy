import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ExamEnrollService, ExamEnrollmentItem } from '../../../../core/service/exam-enroll.service';
import { ExamStateService } from '../../../../core/service/exam-state.service';

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass],
  templateUrl: './student-exams.component.html',
  styleUrl: './student-exams.component.scss'
})
export class StudentExamsComponent implements OnInit {
  private readonly examService = inject(ExamEnrollService);
  private readonly examState = inject(ExamStateService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly exams = signal<ExamEnrollmentItem[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadExams();
  }

  private loadExams(): void {
    this.loading.set(true);
    this.error.set(null);
    this.examService.getExamEnrollments().subscribe({
      next: (res) => {
        if (res.success) {
          this.exams.set(res.data || []);
        } else {
          this.error.set('فشل في تحميل الامتحانات');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('حدث خطأ أثناء تحميل الامتحانات');
        this.loading.set(false);
      }
    });
  }

  startExam(exam: ExamEnrollmentItem): void {
    if (exam.status === 'approved') {
      const url = (exam as any).start_url;
      if (url) {
        window.open(url, '_blank');
        return;
      }
      this.examState.initSession(exam.enrollment_id);
      this.router.navigate(['/courses', exam.enrollment_id, 'exam']);
    }
  }
}
