import { Component, OnInit, OnDestroy, inject, signal, NgZone, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/service/auth.service';
import { ExamEnrollService } from './core/service/exam-enroll.service';
import Lenis from 'lenis';

import AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('languages-translation-center');
  private readonly authService = inject(AuthService);
  private readonly examEnrollService = inject(ExamEnrollService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private lenis?: Lenis;

  ngOnInit(): void {
    // Run Lenis entirely outside Angular zone to prevent constant change detection
    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        autoRaf: true, // Let Lenis handle the requestAnimationFrame loop automatically
      });
    });

    // Scroll to top on navigation end using Lenis
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      if (this.lenis) {
        this.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }

  ngOnDestroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
    }
  }
}
