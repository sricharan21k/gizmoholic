import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../model/product/product';
import { ProductService } from '../../services/product.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../model/cart-item';
import { AuthService } from '../../services/auth.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  searchString = '';
  products: Product[] = [];
  items: Product[] = [];
  cartSize?: Observable<number>;

  @ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;
  constructor(
    private service: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.cartSize = cartService.getUpdatedCart();
  }
  ngOnInit(): void {}

  search() {
    this.router.navigate(['/search', this.searchString]);
  }
  getData() {
    this.service.getAllProducts().subscribe((data) => {
      this.products = data;
      this.items = data;
    });
  }

  filter(event: any) {
    const value = event.target.value.toLowerCase();

    this.items = this.products.filter(
      (x) =>
        x.brand.toLowerCase().includes(value) ||
        x.model.toLowerCase().includes(value) ||
        x.type.toLowerCase().includes(value)
    );
  }

  clickCloseButton() {
    this.closeButton?.nativeElement.click();
  }

  goBack() {
    this.location.back();
  }
  goForward() {
    this.location.forward();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }
}
