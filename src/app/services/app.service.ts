import { Injectable } from '@angular/core';
import { LikedItem } from '../model/liked-item';
import { CartItem } from '../model/cart-item';
import { Product } from '../model/product/product';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  saveWishlist(items: string[]) {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }
  getWishlist(): string[] {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }

  addToWishlist(item: string) {
    const wishlist = this.getWishlist();
    const itemFound = wishlist.some((i) => i === item);
    if (!itemFound) wishlist.push(item);
    this.saveWishlist(wishlist);
  }

  removeFromWishlist(item: string) {
    const wishlist = this.getWishlist();
    const updatedWishlsit = wishlist.filter((i) => i !== item);
    this.saveWishlist(updatedWishlsit);
  }

  clearWishlist() {
    localStorage.removeItem('wishlist');
  }

  // getLikedItemId(): number {
  //   const currentValue = localStorage.getItem('wishlistId');
  //   return currentValue ? JSON.parse(currentValue) : 0;
  // }
  // saveLikedItemId(currentValue: number) {
  //   localStorage.setItem('wishlistId', JSON.stringify(currentValue));
  // }
  // clearLikedItemId() {
  //   localStorage.removeItem('wishlistId');
  // }

  // getWishlist(): LikedItem[] {
  //   const wishlist = localStorage.getItem('wishlist');
  //   return wishlist
  //     ? (JSON.parse(wishlist) as LikedItem[]).map((item) =>
  //         this.deserializeItem(item)
  //       )
  //     : [];
  // }
  // saveWishlist(items: LikedItem[]) {
  //   const wishlist = items.map((item) => this.serializeItem(item));
  //   localStorage.setItem('wishlist', JSON.stringify(wishlist));
  // }
  // addToWishlist(item: LikedItem) {
  //   console.log('item', item);
  //   const wishlist = this.getWishlist();
  //   wishlist.push(item);
  //   this.saveWishlist(wishlist);
  //   this.saveLikedItemId(item.id);
  // }
  // removeFromWishlist(itemId: number) {
  //   const wishlist = this.getWishlist();
  //   if (itemId > 0) {
  //     const updatedList = wishlist.filter((i) => i.id !== itemId);
  //     this.saveWishlist(updatedList);
  //   }
  // }
  // clearWishlist() {
  //   localStorage.removeItem('wishlist');
  // }

  // serializeItem(likedItem: LikedItem) {
  //   const product: Product = likedItem.product;
  //   const serializedCartItem = {
  //     ...likedItem,
  //     product: {
  //       ...product,
  //       variants: Object.fromEntries(product.variants),
  //       colors: Object.fromEntries(product.colors),
  //     },
  //   };

  //   return serializedCartItem;
  // }

  // deserializeItem(serializedLikedItem: LikedItem): LikedItem {
  //   const serializedProduct = serializedLikedItem.product;
  //   const deserializedCartItem = {
  //     ...serializedLikedItem,
  //     product: {
  //       ...serializedProduct,
  //       variants: new Map(Object.entries(serializedProduct.variants)),
  //       colors: new Map(Object.entries(serializedProduct.colors)),
  //     },
  //   };
  //   return deserializedCartItem;
  // }
}
