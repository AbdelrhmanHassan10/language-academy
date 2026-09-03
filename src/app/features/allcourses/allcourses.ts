import { Component, signal } from '@angular/core';
import { AboutCenter } from '../../shared/components/about-center/about-center';
import { AllcoursesCard } from '../../shared/components/allcourses-card/allcourses-card';
import { DidnotFindCourse } from '../../shared/components/didnot-find-course/didnot-find-course';

@Component({
  selector: 'app-allcourses',
  imports: [AboutCenter, AllcoursesCard, DidnotFindCourse],
  templateUrl: './allcourses.html',
  styleUrl: './allcourses.scss',
})
export class Allcourses {
  servicesAbout = {
    title: 'الكورسات والدورات التدريبية',
    description: 'اختر من بين اكثر من 50 برنامج تدريبي متخصص في اللغات والأختبارات الدولية',
  };

  searchTerm = signal(''); // ← add this

  onSearchChange(term: string): void {
    this.searchTerm.set(term); // ← add this
  }
}
