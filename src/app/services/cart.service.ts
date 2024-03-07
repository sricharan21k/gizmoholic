import { Injectable } from '@angular/core';
import { Product } from '../model/product/product';
import { CartItem } from '../model/cart-item';
import {
  BehaviorSubject,
  Observable,
  map,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemSubject = new BehaviorSubject<number>(this.getCart().length);

  saveCart(cartItems: CartItem[]) {
    const cart = cartItems.map((item) => this.serializeItem(item));
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  saveCheckoutItems(checkoutItems: number[]) {
    localStorage.setItem('checkout', JSON.stringify(checkoutItems));
  }

  saveCartItemId(currentValue: number) {
    localStorage.setItem('cartItemId', JSON.stringify(currentValue));
  }
  clearCartItemId() {
    localStorage.removeItem('cartItemId');
  }

  getUpdatedCart(): Observable<number> {
    return this.cartItemSubject.pipe(switchMap((data) => of(data)));
  }

  getCart(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart
      ? (JSON.parse(cart) as CartItem[]).map((item) =>
          this.deserializeItem(item)
        )
      : [];
  }

  getCheckoutItems(): number[] {
    const checkout = localStorage.getItem('checkout');
    return checkout ? JSON.parse(checkout) : [];
  }

  getCartItemId(): number {
    const currentValue = localStorage.getItem('cartItemId');
    return currentValue ? JSON.parse(currentValue) : 0;
  }

  addItemToCart(item: CartItem) {
    const cart = this.getCart();
    const existingCartItems = cart.filter((i) => i.item.id === item.item.id);
    const existingCartItemIndex = existingCartItems.findIndex(
      (i) => i.color === item.color && i.variant === item.variant
    );
    const existingCartItem = cart[existingCartItemIndex];
    if (existingCartItem) {
      console.log('if: existing', existingCartItem, 'new', item);
      cart[existingCartItemIndex].quantity += item.quantity;
      cart[existingCartItemIndex].itemValue += item.itemValue ?? 0;
    } else {
      console.log('else: existing', existingCartItem, 'new', item);
      cart.push(item);
      this.addItemToCheckout(item.id);
      this.saveCartItemId(item.id);
    }
    this.saveCart(cart);
    this.cartItemSubject.next(cart.length);
  }

  addItemToCheckout(item: number) {
    const checkout = this.getCheckoutItems();
    checkout.push(item);
    this.saveCheckoutItems(checkout);
  }

  removeItemFromCart(itemId: number) {
    const cart = this.getCart();
    const updateCart = cart.filter((i) => i.id !== itemId);
    this.saveCart(updateCart);
    this.cartItemSubject.next(updateCart.length);
  }

  removeItemFromCheckout(itemId: number) {
    const checkout = this.getCheckoutItems();
    const updateCheckout = checkout.filter((i) => i !== itemId);
    this.saveCheckoutItems(updateCheckout);
  }

  updateCartItem(itemId: number, itemQuantity: number, itemValue: number) {
    const cart = this.getCart();
    const cartItemIndex = cart.findIndex((i) => i.id === itemId);
    if (cartItemIndex !== -1) {
      cart[cartItemIndex].quantity = itemQuantity;
      cart[cartItemIndex].itemValue = itemValue;
    }
    this.saveCart(cart);
  }

  clearCart() {
    localStorage.removeItem('cart');
    this.clearCheckoutItems();
    this.cartItemSubject.next(0);
    this.clearCartItemId();
  }

  clearCheckoutItems() {
    localStorage.removeItem('checkout');
  }

  serializeItem(cartItem: CartItem) {
    const product: Product = cartItem.item;
    const serializedCartItem = {
      ...cartItem,
      item: {
        ...product,
        variants: Object.fromEntries(product.variants),
        colors: Object.fromEntries(product.colors),
      },
    };

    return serializedCartItem;
  }

  deserializeItem(serializedCartItem: CartItem): CartItem {
    const serializedProduct = serializedCartItem.item;
    const deserializedCartItem = {
      ...serializedCartItem,
      item: {
        ...serializedProduct,
        variants: new Map(Object.entries(serializedProduct.variants)),
        colors: new Map(Object.entries(serializedProduct.colors)),
      },
    };
    return deserializedCartItem;
  }
}
