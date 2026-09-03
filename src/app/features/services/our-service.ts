import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Service item data interface */
export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  button_text: string;
  button_link: string;
  gradient_from: string;
  gradient_to: string;
  created_at: string;
  updated_at: string;
}

/** Services API response interface */
export interface ServicesResponse {
  success: boolean;
  message: string;
  data: ServiceItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OurService {
  private readonly http = inject(HttpClient);

  /**
   * Fetch all services
   * @returns Observable with services response
   */
  getServices(page: number = 1): Observable<ServicesResponse> {
    return this.http.get<ServicesResponse>(`${environment.baseUrl}/student/services?page=${page}`);
  }
}
