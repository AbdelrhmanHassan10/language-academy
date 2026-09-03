import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './exam.html',
  styleUrl: './exam.scss',
})
export class Exam {

  constructor(private router: Router) {}

  goToCourses() {
    this.router.navigate(['/allcourses']);
  }
}
