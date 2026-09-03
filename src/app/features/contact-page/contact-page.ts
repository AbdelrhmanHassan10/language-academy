import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { AboutCenter } from '../../shared/components/about-center/about-center';
import { ContactStatistics } from '../../shared/components/contact-statistics/contact-statistics';
import { ContactDetails } from '../../shared/components/contact-details/contact-details';
import { Questions } from '../../shared/components/questions/questions';
import { NeedHelp } from '../../shared/components/need-help/need-help';
import { FaqService } from './faq.service';
import { FAQ, FAQPagination } from './faq.model';

@Component({
  selector: 'app-contact-page',
  imports: [AboutCenter, ContactStatistics, ContactDetails, Questions, NeedHelp],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage implements OnInit {
  private faqService = inject(FaqService);

  servicesAbout = {
    title: 'تواصل معنا',
    description: 'نحن هنا لمساعدتك! تواصل معنا عبرأي من القنوات التاليه',
  };

  faqs = signal<FAQ[]>([]);
  faqPagination = signal<FAQPagination | null>(null);
  faqLoading = signal(false);
  faqError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFaqs(1);
  }

  loadFaqs(page: number): void {
    this.faqLoading.set(true);
    this.faqError.set(null);

    this.faqService.getFaqs(page).subscribe({
      next: (res) => {
        this.faqs.update((current) => (page === 1 ? res.data : [...current, ...res.data]));
        this.faqPagination.set(res.pagination);
        this.faqLoading.set(false);
      },
      error: () => {
        this.faqError.set('حدث خطأ أثناء تحميل الأسئلة الشائعة');
        this.faqLoading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    this.loadFaqs(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // optional
  }
}
