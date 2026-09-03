import { Component, signal } from '@angular/core';
import { AboutCenter } from '../../shared/components/about-center/about-center';
import { AllexamsCard } from '../../shared/components/allexams-card/allexams-card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-exams',
  imports: [AboutCenter, AllexamsCard, RouterLink],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams {
  servicesAbout = {
    title: 'الامتحانات والاختبارات الدولية',
    description: 'استعد لاختباراتك الدولية مع أفضل المحاكاة والتدريبات المعتمدة',
  };

  searchTerm = signal('');

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
