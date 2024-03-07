import { Component, Input, OnInit } from '@angular/core';
import { Address } from '../../model/address';
import { CartItem } from '../../model/cart-item';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../model/order/order';
import { OrderItem } from '../../model/order/order-item';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  componentName: string = 'checkout';
  items: CartItem[] = [];
  address: number = 1;
  order: Order = {};
  orderItems: OrderItem[] = [];
  orderId?: number;
  constructor(
    private cartService: CartService,
    private userService: UserService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.dataService.notifyParent(this.componentName);
    const checkoutItems = this.cartService.getCheckoutItems();
    const cartItems = this.cartService.getCart();

    this.items = cartItems.filter((i) => checkoutItems.includes(i.id));
  }

  placeOrder() {
    this.order = {
      paymentMode: 'Cash On Delivery',
      shippingAddress: this.address,
      items: this.items.map(({ id, item, ...props }) => ({
        ...props,
        item: item.id,
      })),
    };

    this.userService.placeOrder(this.order).subscribe((res) => {
      this.cartService.clearCart();
      this.router.navigate(['../review', res.id], { relativeTo: this.route });
    });

    // location.reload();
  }
}
