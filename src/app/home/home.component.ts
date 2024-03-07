import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  items = [1, 2, 3, 4, 5, 6];
  x = this.items.length % 2 === 0 ? 2 : 1;
  // items = [1];
}
