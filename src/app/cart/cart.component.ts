import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  activeStep: number = 0;
  constructor(private dataService: DataService, private router: Router) {
    this.subscribeToRouterEvents();
  }
  ngOnInit() {}

  private subscribeToRouterEvents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('/cart/review')) {
          this.activeStep = 3;
        } else if (url.includes('/cart/checkout')) {
          this.activeStep = 2;
        } else if (url.includes('/cart')) {
          this.activeStep = 1;
        } else {
          // Default to the first step if the URL doesn't match any known step
          this.activeStep = 0;
        }
      }
    });
  }
}
