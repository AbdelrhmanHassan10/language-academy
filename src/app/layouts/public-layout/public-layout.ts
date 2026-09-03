import { Component, inject, signal } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { PromoBanner } from '../../shared/components/promo-banner/promo-banner';
import { Sigin } from '../../features/auth/components/sigin/sigin';
import { Signup } from '../../features/auth/components/signup/signup';
import { ForgotPassword } from '../../features/auth/components/forgot-password/forgot-password';
import { AuthDialogService } from '../../core/service/auth-dialog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  imports: [CommonModule, Navbar, RouterOutlet, Footer, PromoBanner, Sigin, Signup, ForgotPassword],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class PublicLayout {
  authDialog = inject(AuthDialogService);
  showBackToTop = signal(false);

  onWindowScroll(): void {
    const yOffset = window.pageYOffset || document.documentElement.scrollTop;
    this.showBackToTop.set(yOffset > 300);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onLoginClosed(): void {
    this.authDialog.closeLogin();
  }

  onSignupClosed(): void {
    this.authDialog.closeSignup();
  }

  onForgotPasswordClosed(): void {
    this.authDialog.closeForgotPassword();
  }

  onOpenSignUp(): void {
    this.authDialog.openSignup();
  }

  onOpenForgotPassword(): void {
    this.authDialog.openForgotPassword();
  }

  onOpenSignIn(): void {
    this.authDialog.openLogin();
  }
}
