import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** About Us data interface */
export interface AboutUsData {
  id: number;
  hero_title: string;
  hero_description: string;
  image: string;
  vision: string;
  mission: string;
  goals: string;
  advantages: string[];
  created_at: string;
  updated_at: string;
}

/** API response interface */
export interface AboutUsResponse {
  success: boolean;
  message: string;
  data: AboutUsData;
}

/** Timeline event data interface */
export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/** Timeline events API response interface */
export interface TimelineEventsResponse {
  success: boolean;
  message: string;
  data: TimelineEvent[];
}

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly http = inject(HttpClient);

  /**
   * Fetch about us page data
   * @returns Observable with about us response
   */
  getAboutUs(): Observable<AboutUsResponse> {
    return this.http.get<AboutUsResponse>(`${environment.baseUrl}/student/about-us`);
  }

  /**
   * Fetch timeline events
   * @returns Observable with timeline events response
   */
  getTimelineEvents(): Observable<TimelineEventsResponse> {
    return this.http.get<TimelineEventsResponse>(`${environment.baseUrl}/student/timeline-events`);
  }
}
