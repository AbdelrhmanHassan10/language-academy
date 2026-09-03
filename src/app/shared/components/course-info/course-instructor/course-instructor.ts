import { Component, input } from '@angular/core';

@Component({
  selector: 'app-course-instructor',
  imports: [],
  templateUrl: './course-instructor.html',
  styleUrl: './course-instructor.scss',
})
export class CourseInstructor {
  instructorName = input<string>('');
}
