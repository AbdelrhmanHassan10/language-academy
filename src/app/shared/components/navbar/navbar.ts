import { Component, computed, inject, signal, NgZone, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { AuthDialogService } from '../../../core/service/auth-dialog.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  host: {
    class: 'sticky top-0 z-50 w-full block',
  },
})
export class Navbar implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly authDialog = inject(AuthDialogService);
  private readonly ngZone = inject(NgZone);

  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  notificationCount = signal(1);
  isScrolled = signal(false);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userDisplayName = computed(() => this.authService.user()?.full_name || 'المستخدم');

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

  toggleMenu() {
    this.isMenuOpen.update((val) => !val);
  }

  openSignupModal() {
    this.authDialog.openSignup();
  }

  openSigninModal() {
    this.authDialog.openLogin();
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen.set(false);
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update((val) => !val);
  }
}
