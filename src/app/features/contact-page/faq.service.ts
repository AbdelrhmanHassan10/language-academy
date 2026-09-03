import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FAQResponse } from './faq.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/student/faqs`;

  getFaqs(page = 1): Observable<FAQResponse> {
    const params = new HttpParams().set('page', page);
    return this.http.get<FAQResponse>(this.baseUrl, { params });
  }
}
