import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/service/course.service';
import { CourseListItem } from '../../../core/models/course.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-similar-courses',
  templateUrl: './similar-courses.html',
  styleUrls: ['./similar-courses.scss'],
})
export class SimilarCourses implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);

  allCourses = signal<CourseListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentCourseId = signal<number | null>(null);

  private router = inject(Router);
  navigateToCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  similarCourses = computed(() => {
    const id = this.currentCourseId();
    return this.allCourses().filter((c) => c.id !== id);
  });

  ngOnInit(): void {
    // ✅ Subscribe instead of snapshot — fires on every param change
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.currentCourseId.set(id);
      this.loadCourses();
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    });
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.courseService.getCourses(1).subscribe({
      next: (res) => {
        this.allCourses.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('حدث خطأ أثناء تحميل الكورسات');
        this.loading.set(false);
      },
    });
  }
}
