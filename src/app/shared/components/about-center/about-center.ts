import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about-center',
  imports: [FormsModule],
  templateUrl: './about-center.html',
  styleUrl: './about-center.scss',
})
export class AboutCenter {
  servicesAbout = input<{ title: string; description: string } | null>();
  showSearch = input<boolean>(false);

  searchChange = output<string>();
  searchTerm = '';

  onInput(): void {
    // Fires on every keystroke — instant frontend filtering
    this.searchChange.emit(this.searchTerm);
  }

  onClear(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }
}