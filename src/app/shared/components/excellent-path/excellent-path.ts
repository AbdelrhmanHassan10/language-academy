import { Component, inject, OnInit, signal } from '@angular/core';
import { AboutService, TimelineEvent } from '../../../features/about/about-service';

@Component({
  selector: 'app-excellent-path',
  imports: [],
  templateUrl: './excellent-path.html',
  styleUrl: './excellent-path.scss',
})
export class ExcellentPath implements OnInit {
  private readonly aboutService = inject(AboutService);

  timelineEvents = signal<TimelineEvent[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.aboutService.getTimelineEvents().subscribe({
      next: (response) => {
        this.timelineEvents.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching timeline events:', error);
        this.isLoading.set(false);
      },
    });
  }

  /** Check if event should be on the left side (odd index) */
  isLeftSide(index: number): boolean {
    return index % 2 === 0;
  }
}
