import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-learning-lang',
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './learning-lang.html',
  styleUrl: './learning-lang.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningLang {}
