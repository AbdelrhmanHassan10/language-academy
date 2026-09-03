import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamListResponse } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private http = inject(HttpClient);
  private baseUrl = 'https://translate.ghosnworld.com/public/api/student';

  getExams(): Observable<ExamListResponse> {
    return this.http.get<ExamListResponse>(`${this.baseUrl}/exams-list`);
  }
}
