import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EducationalCard } from '../../../features/home/home-models';

@Component({
  selector: 'app-educational-cards',
  imports: [RouterLink],
  templateUrl: './educational-cards.html',
  styleUrl: './educational-cards.scss',
})
export class EducationalCards {
  cards = input<EducationalCard>();

}
