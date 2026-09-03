import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { authGuard } from './core/guard/auth.guard';
import { guestGuard } from './core/guard/guest.guard';
export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.routes),
      },
      {
        path: 'about',
        loadChildren: () => import('./features/about/about.routes').then((m) => m.routes),
      },
      {
        path: 'services',
        loadChildren: () => import('./features/services/services.routes').then((m) => m.routes),
      },
      {
        path: 'allcourses',
        loadChildren: () => import('./features/allcourses/allcourses.routes').then((m) => m.routes),
      },
      {
        path: 'contact-page',
        loadChildren: () =>
          import('./features/contact-page/contact-page.routes').then((m) => m.routes),
      },
      {
        path: 'exams',
        loadChildren: () => import('./features/exams/exams.routes').then((m) => m.routes),
      },
      {
        path: 'courses',
        loadChildren: () => import('./features/courses/course.routes').then((m) => m.routes),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./features/profile/profile.routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    component: AuthLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routes),
      },
    ],
  },


  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
