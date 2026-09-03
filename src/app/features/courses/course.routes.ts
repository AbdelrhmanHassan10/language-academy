import { Routes } from '@angular/router';
import { authGuard } from '../../core/guard/auth.guard';
import { examDeactivateGuard } from '../../core/guard/exam-deactivate.guard';
import { examGuard } from '../../core/guard/exam.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./components/course-list/course-list').then((m) => m.CourseListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/course-details/course-details').then((m) => m.CourseDetailsComponent),
  },
  {
    path: ':id/exam',
    loadComponent: () =>
      import('./components/examComponent/exam-container/exam-container').then(
        (m) => m.ExamContainer,
      ),
    canActivate: [authGuard, examGuard],
    canDeactivate: [examDeactivateGuard],
  },
  {
    path: ':id/exam-result',
    loadComponent: () =>
      import('./components/examComponent/exam-result/exam-result').then(
        (m) => m.ExamResultComponent,
      ),
    canActivate: [authGuard],
  },
];
