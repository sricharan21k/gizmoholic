import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { OrderComponent } from './order/order.component';
import { AddressComponent } from './address/address.component';
import { ReviewComponent } from './review/review.component';
import { WishlistComponent } from './wishlist/wishlist.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [
    RouterModule,
    AccountComponent,
    OrderComponent,
    AddressComponent,
    ReviewComponent,
    WishlistComponent,
  ],
})
export class ProfileComponent {
  constructor(private route: ActivatedRoute) {}
  // ngOnInit(): void {
  //   this.route.fragment.subscribe((data) => {
  //     if (data) {
  //       this.jumpToSection(data);
  //     }
  //   });
  // }

  // jumpToSection(section: string) {
  //   document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  // }
}
