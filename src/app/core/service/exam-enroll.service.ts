import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExamListItem {
  id: number;
  name: string;
}

export interface ExamsListResponse {
  success: boolean;
  message: string;
  data: ExamListItem[];
}

export interface ExamEnrollResponse {
  success: boolean;
  message: string;
  data?: {
    enrollment_id?: number;
    exam_id?: number;
  };
  errors?: Record<string, unknown>;
}

export interface ExamEnrollmentItem {
  enrollment_id: number;
  exam_name: string;
  price: string;
  status: string;
  status_label?: string;
  registered_at: string;
  exam_details?: {
    date: string;
    day: string;
    time_formatted: string;
    instructions: string;
  };
  result?: {
    score: number;
    max_score: number;
    percentage: number;
  };
}

export interface ExamEnrollmentsResponse {
  success: boolean;
  message: string;
  data: ExamEnrollmentItem[];
}

export interface ExamDetails {
  date: string;            // e.g. "2026-04-10"
  day: string;             // e.g. "Friday" or "الجمعة"
  time_formatted: string;  // e.g. "09:30 AM"
}

export interface EnrollmentStatusData {
  enrollment_id: number;
  exam_name: string;
  status: string;
  status_label?: string;
  exam_details?: ExamDetails;
  instructions?: string;
  can_start?: boolean;
  start_url?: string;
}

export interface EnrollmentStatusResponse {
  success: boolean;
  message: string;
  data: EnrollmentStatusData;
}

@Injectable({ providedIn: 'root' })
export class ExamEnrollService {
  private readonly http = inject(HttpClient);

  private readonly examsCache = signal<ExamListItem[] | null>(null);

  getExamsList(): Observable<ExamsListResponse> {
    const cached = this.examsCache();
    if (cached) {
      return of({ success: true, message: 'Cached', data: cached });
    }

    return this.http.get<ExamsListResponse>(`${environment.baseUrl}/student/exams-list`).pipe(
      tap((res: ExamsListResponse) => {
        if (res.success) {
          this.examsCache.set(res.data);
        }
      })
    );
  }

  checkEnrollment(examId: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/student/exam/${examId}`).pipe(
      catchError((error) => {
        // Return the error body so components can check for enrollment_id
        return of(error.error || { success: false });
      })
    );
  }

  getExamEnrollments(): Observable<ExamEnrollmentsResponse> {
    return this.http.get<ExamEnrollmentsResponse>(`${environment.baseUrl}/student/exam-enrollments`);
  }

  checkEnrollmentStatus(enrollmentId: number): Observable<EnrollmentStatusResponse> {
    return this.http.get<EnrollmentStatusResponse>(`${environment.baseUrl}/student/enrollment-status/${enrollmentId}`);
  }

  enrollEgyptian(formData: FormData): Observable<ExamEnrollResponse> {
    return this.http.post<ExamEnrollResponse>(
      `${environment.baseUrl}/student/exams/enroll`,
      formData,
    );
  }

  enrollExpatriate(formData: FormData): Observable<ExamEnrollResponse> {
    return this.http.post<ExamEnrollResponse>(
      `${environment.baseUrl}/student/exams/enroll`,
      formData,
    );
  }
}
