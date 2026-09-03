import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CoursesListResponse, CourseDetailsResponse } from '../models/course.model';

export interface CourseEnrollmentItem {
  enrollment_id: number;
  course_name: string;
  price: string;
  status: string;
  registered_at: string;
  course_details?: {
    instructor_name: string;
    level: string;
    start_date: string;
    end_date: string;
    duration_days: string;
    location: string;
  };
}

export interface CourseEnrollmentsResponse {
  success: boolean;
  message: string;
  data: CourseEnrollmentItem[];
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/student/courses`;

  getCourses(page = 1): Observable<CoursesListResponse> {
    const params = new HttpParams().set('page', page);
    return this.http.get<CoursesListResponse>(this.baseUrl, { params });
  }

  getCourseDetails(id: number): Observable<CourseDetailsResponse> {
    return this.http.get<CourseDetailsResponse>(`${this.baseUrl}/${id}`);
  }

  getCourseEnrollments(): Observable<CourseEnrollmentsResponse> {
    return this.http.get<CourseEnrollmentsResponse>(
      `${environment.baseUrl}/student/course-enrollments`,
    );
  }

  /**
   * Register an Egyptian student for a course
   * @param formData Multipart form data including receipt image
   * @returns Observable with API response
   */
  registerEgyptian(courseId: number, formData: FormData): Observable<any> {
    return this.http.post(`${environment.baseUrl}/student/courses/${courseId}/enroll`, formData);
  }

  registerExpatriate(courseId: number, formData: FormData): Observable<any> {
    return this.http.post(`${environment.baseUrl}/student/courses/${courseId}/enroll`, formData);
  }
}
