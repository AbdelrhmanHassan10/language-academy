import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-success-pop-up',
  imports: [],
  templateUrl: './success-pop-up.html',
  styleUrl: './success-pop-up.scss',
})
export class SuccessPopUp {
  visible = model<boolean>(false);
  title = input<string>('');
  message = input<string>('');
  icon = input<string>('');
}
