import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ready-to-start',
  imports: [RouterLink],
  templateUrl: './ready-to-start.html',
  styleUrl: './ready-to-start.scss',
})
export class ReadyToStart {
  router = inject(Router);

  goToContact(): void {
    this.router.navigate(['/contact-page']);
  }
}
