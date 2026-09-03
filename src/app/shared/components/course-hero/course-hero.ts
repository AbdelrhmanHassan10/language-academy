import { NgOptimizedImage } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { CourseRegister } from '../course-register/course-register';
import { CourseDetails } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-hero',
  imports: [NgOptimizedImage, CourseRegister],
  templateUrl: './course-hero.html',
  styleUrl: './course-hero.scss',
})
export class CourseHero {
  course = input<CourseDetails>();
  courseId = input<number | null>(null);
  id = signal<number | null>(null);
  isRegisterPanelOpen = signal(false);
}
