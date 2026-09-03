import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService, ProfileResponse } from '../../core/service/auth.service';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudentExamsComponent } from './components/student-exams/student-exams.component';
import { StudentCoursesComponent } from './components/student-courses/student-courses.component';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, NgClass, StudentExamsComponent, StudentCoursesComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly profileData = signal<ProfileResponse['data']['user'] | null>(null);

  readonly activeTab = signal<'exams' | 'courses'>('exams');
  readonly showRegistrationsModal = signal(false);

  ngOnInit(): void {
    this.loadProfile();
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'exams' || tab === 'courses') {
        this.openRegistrations(tab);
      }
    });
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.profileData.set(res.data.user);
          // Update stored user data
          this.authService.setUser({
            id: res.data.user.id,
            full_name: res.data.user.full_name,
            email: res.data.user.email,
            phone: res.data.user.phone,
            created_at: res.data.user.created_at,
          });
        } else {
          this.error.set('فشل في تحميل الملف الشخصي');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('حدث خطأ أثناء تحميل البيانات');
        this.loading.set(false);
      },
    });
  }

  setTab(tab: 'exams' | 'courses'): void {
    this.activeTab.set(tab);
  }

  openRegistrations(tab: 'exams' | 'courses'): void {
    this.activeTab.set(tab);
    this.showRegistrationsModal.set(true);
  }

  closeRegistrations(): void {
    this.showRegistrationsModal.set(false);
  }
}
