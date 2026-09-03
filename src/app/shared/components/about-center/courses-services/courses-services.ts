import { Component, inject, OnInit, signal } from '@angular/core';
import { OurService, ServiceItem } from '../../../../features/services/our-service';

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

@Component({
  selector: 'app-courses-services',
  imports: [],
  templateUrl: './courses-services.html',
  styleUrl: './courses-services.scss',
})
export class CoursesServices implements OnInit {
  private readonly ourService = inject(OurService);

  services = signal<ServiceItem[]>([]);
  isLoading = signal(true);
  pagination = signal<Pagination | null>(null);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadServices(1);
  }

  loadServices(page: number): void {
    this.isLoading.set(true);
    this.ourService.getServices(page).subscribe({
      next: (response) => {
        this.services.set(response.data);
        this.pagination.set(response.pagination);
        this.currentPage.set(response.pagination.current_page);
        this.isLoading.set(false);
        // Scroll to top of section on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Error fetching services:', error);
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    const p = this.pagination();
    if (!p) return;
    if (page < 1 || page > p.last_page) return;
    if (page === this.currentPage()) return;
    this.loadServices(page);
  }

  /** Check if service should have image on right side (alternating layout) */
  isImageLeft(index: number): boolean {
    return index % 2 === 0;
  }

  /** Generate page numbers array with ellipsis (-1) where needed */
  getPageNumbers(): number[] {
    const p = this.pagination();
    if (!p) return [];

    const total = p.last_page;
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      // Show all pages
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1); // ellipsis
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push(-1); // ellipsis
      pages.push(total);
    }

    return pages;
  }
}
