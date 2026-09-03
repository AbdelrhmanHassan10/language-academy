import { Component, signal, NgZone, OnInit, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'app-promo-banner',
  imports: [],
  templateUrl: './promo-banner.html',
  styleUrl: './promo-banner.scss',
})
export class PromoBanner implements OnInit, OnDestroy {
  isScrolled = signal(false);
  private readonly ngZone = inject(NgZone);
  private scrollListener!: () => void;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        const scrolled = window.scrollY > 50;
        if (scrolled !== this.isScrolled()) {
          this.ngZone.run(() => {
            this.isScrolled.set(scrolled);
          });
        }
      };
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
