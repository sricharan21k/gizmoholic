import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../model/cart-item';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css',
})
export class CartItemsComponent implements OnInit {
  componentName: string = 'cart';
  cartItems: CartItem[] = [];
  checkoutItems: number[] = [];

  constructor(
    private cartService: CartService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService.notifyParent(this.componentName);
    this.cartItems = this.cartService.getCart();
    this.checkoutItems = this.cartService.getCheckoutItems();
  }

  toggleSelectAll() {
    if (this.areAllSelected()) {
      this.checkoutItems = [];
    } else {
      this.checkoutItems = this.cartItems.map((i) => i.id);
    }
    this.cartService.saveCheckoutItems(this.checkoutItems);
  }
  areAllSelected() {
    return this.cartItems.length === this.checkoutItems.length;
  }

  incrementQuantity(itemId: number) {
    const itemIndex = this.cartItems.findIndex((i) => i.id === itemId);
    const cartItem = this.cartItems[itemIndex];
    const variantValue = cartItem.item.variants.get(cartItem.variant) as number;
    if (itemIndex != -1) {
      this.cartItems[itemIndex].quantity += 1;
      this.cartItems[itemIndex].itemValue += variantValue;
    }
    this.cartService.updateCartItem(
      itemId,
      this.cartItems[itemIndex].quantity,
      this.cartItems[itemIndex].itemValue
    );
  }

  decrementQuantity(itemId: number) {
    const itemIndex = this.cartItems.findIndex((i) => i.id === itemId);
    const cartItem = this.cartItems[itemIndex];
    const variantValue = cartItem.item.variants.get(cartItem.variant) as number;
    if (itemIndex != -1) {
      this.cartItems[itemIndex].quantity -= 1;
      this.cartItems[itemIndex].itemValue -= variantValue;
    }
    this.cartService.updateCartItem(
      itemId,
      this.cartItems[itemIndex].quantity,
      this.cartItems[itemIndex].itemValue
    );
  }

  removeItemFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter((i) => i.id !== itemId);
    this.checkoutItems = this.checkoutItems.filter((i) => i != itemId);
    this.cartService.removeItemFromCart(itemId);
    this.cartService.removeItemFromCheckout(itemId);
  }

  toggleCheckout(item: number) {
    const updateCheckoutItems = this.checkoutItems.includes(item)
      ? this.checkoutItems.filter((i) => i !== item)
      : [...this.checkoutItems, item];
    this.checkoutItems = updateCheckoutItems;
    this.cartService.saveCheckoutItems(updateCheckoutItems);
  }

  itemSelected(itemId: number) {
    return this.checkoutItems.some((i) => i === itemId);
  }

  clearCart() {
    this.cartItems = [];
    this.checkoutItems = [];
    this.cartService.clearCart();
    this.cartService.clearCheckoutItems();
  }
  toPascalCase(str: string): string {
    if (/^\d/.test(str)) {
      return str.toUpperCase();
    }
    const words = str.split(' ');
    const pascalCaseWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return pascalCaseWords.join(' ');
  }

  cartValue(): number {
    return this.cartItems
      .filter((i) => this.checkoutItems.includes(i.id))
      .reduce((acc, curr) => {
        return acc + curr.itemValue;
      }, 0);
  }
  trackIndex(index: number, item: any): number {
    return index;
  }
}
