import { Component, computed, input } from '@angular/core';
import { CourseDetails } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-overview',
  imports: [],
  templateUrl: './course-overview.html',
  styleUrl: './course-overview.scss',
})
export class CourseOverview {
  course = input<CourseDetails>();

  courseDescription = computed(() => this.course()?.description ?? '');
}
