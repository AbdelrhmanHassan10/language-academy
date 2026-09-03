import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService, CourseEnrollmentItem } from '../../../../core/service/course.service';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass],
  templateUrl: './student-courses.component.html',
  styleUrl: './student-courses.component.scss',
})
export class StudentCoursesComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly courses = signal<CourseEnrollmentItem[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);
    this.courseService.getCourseEnrollments().subscribe({
      next: (res) => {
        if (res.success) {
          this.courses.set(res.data || []);
        } else {
          this.error.set('فشل في تحميل الكورسات');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('حدث خطأ أثناء تحميل الكورسات');
        this.loading.set(false);
      },
    });
  }

  viewCourse(id: number): void {
    this.router.navigate(['/courses', id]);
  }
}
