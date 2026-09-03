import { Component, OnInit, inject, signal } from '@angular/core';
import { CourseListItem } from '../../../core/models/course.model';
import { CourseService } from '../../../core/service/course.service';
import { CommonModule } from '@angular/common';
import { CourseRegister } from '../course-register/course-register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, CourseRegister],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
  standalone: true,
})
export class Courses implements OnInit {
  private readonly courseService = inject(CourseService);

  courses = signal<CourseListItem[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  selectedCourseId = signal<number | null>(null);
  isRegisterModalOpen = signal(false);

 private router = inject(Router);
  navigateToCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  openRegisterModal(event: Event, courseId: number) {
    event.preventDefault();
    event.stopPropagation();

    console.log('setting courseId to:', courseId); // ✅ add this to verify

    this.selectedCourseId.set(courseId); // set FIRST
    this.isRegisterModalOpen.set(true); // open SECOND
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.courseService.getCourses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.courses.set(response.data);
        } else {
          this.error.set(response.message || 'Failed to load courses');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.error.set('Failed to load courses. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }
}
