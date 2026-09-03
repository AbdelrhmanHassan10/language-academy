import { Component, input, signal,effect  } from '@angular/core';
import { CourseOverview } from './course-overview/course-overview';
import { CourseInstructor } from './course-instructor/course-instructor';
import { CourseReviews } from './course-reviews/course-reviews';
import { CourseCurriculum } from './course-curriculum/course-curriculum';
import { CourseDetails } from '../../../core/models/course.model';
import { CourseRegister } from '../course-register/course-register';

@Component({
  selector: 'app-course-info',
  imports: [CourseOverview, CourseInstructor, CourseCurriculum, CourseReviews, CourseRegister],
  templateUrl: './course-info.html',
  styleUrl: './course-info.scss',
})
export class CourseInfo {
  course = input<CourseDetails>();
  activeTab = signal<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');

  setTab(tab: 'overview' | 'curriculum' | 'instructor' | 'reviews') {
    this.activeTab.set(tab);
  }
  courseId = input<number | null>(null);
  isRegisterPanelOpen = signal(false);
    constructor() {
    // ✅ This will print every time courseId changes
    effect(() => {
      console.log('CourseInfo courseId:', this.courseId());
    });
  }
}
