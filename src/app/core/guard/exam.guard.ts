import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { ExamEnrollService } from '../service/exam-enroll.service';
import { ExamStatus } from '../models/exam.model';
import { ExamStateService } from '../service/exam-state.service';

export const examGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const examEnrollService = inject(ExamEnrollService);
  const examStateService = inject(ExamStateService);
  const examId = Number(route.paramMap.get('id'));

  if (!examId) {
    router.navigate(['/']);
    return of(false);
  }

  return examEnrollService.checkEnrollmentStatus(examId).pipe(
    catchError((error) => of(error.error || { success: false })),
    map((response: any) => {
      const status = response.status || response.data?.status;
      const enrollId = Number(response.enrollment_id || response.data?.enrollment_id || examId);
      const hasActiveSession = examStateService.hasActiveSession(enrollId);

      if (status === ExamStatus.COMPLETED) {
        examStateService.invalidateEnrollment(enrollId);
        router.navigate(['/courses', enrollId, 'exam-result']);
        return false;
      }

      if (status === ExamStatus.APPROVED) {
        // Redirect to enrollment-specific ID if current URL uses category ID
        if (enrollId !== examId) {
          router.navigate(['/courses', enrollId, 'exam']);
          return false;
        }

        if (hasActiveSession) {
          examStateService.restoreEnrollmentIdFromSession(enrollId);
          return true;
        }

        alert('You must click "Start Exam" to begin.');
        router.navigate(['/courses', enrollId]);
        return false;
      }

      examStateService.invalidateEnrollment(enrollId);

      // If pending or not enrolled, redirect
      if (status === ExamStatus.PENDING) {
        alert('Your request is pending review.');
      } else {
        alert('You must register for the exam first.');
      }

      router.navigate(['/courses', enrollId]);
      return false;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    }),
  );
};
