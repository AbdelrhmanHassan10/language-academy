import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ExamStateService } from '../service/exam-state.service';

/**
 * Warns the user before navigating away from the exam page if there are
 * unsaved (unsubmitted) answers in progress.
 */
export const examDeactivateGuard: CanDeactivateFn<unknown> = () => {
  const examState = inject(ExamStateService);

  if (examState.isSubmitted()) return true;
  if (!examState.hasUnsavedProgress()) return true;

  return confirm(
    'Are you sure you want to leave the exam?\n\n' +
      'Your progress has been saved locally. You can return to continue where you left off.',
  );
};
