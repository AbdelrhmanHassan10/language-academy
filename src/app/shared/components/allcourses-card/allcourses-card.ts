import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/service/course.service';
import { CourseListItem, Pagination } from '../../../core/models/course.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allcourses-card',
  imports: [FormsModule],
  templateUrl: './allcourses-card.html',
  styleUrl: './allcourses-card.scss',
})
export class AllcoursesCard implements OnInit {
  private courseService = inject(CourseService);
  /** Search term passed from parent — filtering is done on the frontend */
  search = input<string>('');
  private router = inject(Router);
  navigateToCourse(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }
  allCourses = signal<CourseListItem[]>([]);
  pagination = signal<Pagination | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);

  /** Courses filtered by search term (no API call) */
  filteredCourses = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.allCourses();
    return this.allCourses().filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.category?.name.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadCourses(1);
  }

  loadCourses(page: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(page);

    this.courseService.getCourses(page).subscribe({
      next: (res) => {
        this.allCourses.set(res.data);
        this.pagination.set(res.pagination);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('حدث خطأ أثناء تحميل الكورسات');
        this.loading.set(false);
      },
    });
  }

  get pages(): number[] {
    const p = this.pagination();
    if (!p) return [];
    return Array.from({ length: p.last_page }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    const p = this.pagination();
    if (!p || page < 1 || page > p.last_page) return;
    this.loadCourses(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
