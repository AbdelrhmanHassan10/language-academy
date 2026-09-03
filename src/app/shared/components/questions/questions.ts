import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FAQ, FAQPagination } from '../../../features/contact-page/faq.model';

@Component({
  selector: 'app-questions',
  imports: [],
  templateUrl: './questions.html',
  styleUrl: './questions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Questions {
  faqs = input<FAQ[]>([]);
  pagination = input<FAQPagination | null>(null);
  loading = input(false);
  error = input<string | null>(null);

  pageChange = output<number>(); // ✅ changed from loadMore to pageChange

  openIndex: number | null = null;

  get pages(): number[] {
    const p = this.pagination();
    if (!p) return [];
    return Array.from({ length: p.last_page }, (_, i) => i + 1);
  }

  get currentPage(): number {
    return this.pagination()?.current_page ?? 1;
  }

  get lastPage(): number {
    return this.pagination()?.last_page ?? 1;
  }

  toggleFaq(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage) return;
    this.openIndex = null; // close any open FAQ on page change
    this.pageChange.emit(page);
  }
}
