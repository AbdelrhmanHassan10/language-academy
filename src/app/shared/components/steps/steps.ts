import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-steps',
  imports: [RouterLink],
  templateUrl: './steps.html',
  styleUrl: './steps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Steps {

}
