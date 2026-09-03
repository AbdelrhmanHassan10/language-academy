import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-contact-us',
  imports: [RouterLink],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss',
  standalone: true
})
export class ContactUs {
}
