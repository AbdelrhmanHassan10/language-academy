import { Component, input } from '@angular/core';
import { CourseTopic } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-curriculum',
  imports: [],
  templateUrl: './course-curriculum.html',
  styleUrl: './course-curriculum.scss',
})
export class CourseCurriculum {
  topics = input<CourseTopic[]>([]);
}
