import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseHero } from '../../../../shared/components/course-hero/course-hero';
import { CourseInfo } from '../../../../shared/components/course-info/course-info';
import { SimilarCourses } from '../../../../shared/components/similar-courses/similar-courses';
import { CourseService } from '../../../../core/service/course.service';
import { CourseDetails } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-details',
  imports: [CourseHero, CourseInfo, SimilarCourses],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.scss'],
})
export class CourseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  courseData = signal<CourseDetails | null>(null);
  courseId = signal<number | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('معرف الكورس غير صالح');
      this.loading.set(false);
      return;
    }

    this.courseId.set(id);

    this.courseService.getCourseDetails(id).subscribe({
      next: (res) => {
        this.courseData.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('حدث خطأ أثناء تحميل بيانات الكورس');
        this.loading.set(false);
      },
    });
  }
}
