import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage, NgForOf } from '@angular/common';
import { AboutService, AboutUsData } from '../../../features/about/about-service';
@Component({
  selector: 'app-about-who',
  imports: [NgOptimizedImage, NgForOf],
  templateUrl: './about-who.html',
  styleUrl: './about-who.scss',
})
export class AboutWho {
  aboutServices = inject(AboutService);
  aboutUsData = signal<AboutUsData | null>(null);

  ngOnInit(): void {
    this.aboutData();
  }
  aboutData() {
    this.aboutServices.getAboutUs().subscribe({
      next: (response) => {
        console.log(response);
        this.aboutUsData.set(response.data);
      },
      error: (error) => {
        console.error('Error fetching about us data:', error);
      },
    });
  }
}
