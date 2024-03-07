import { Component, OnInit } from '@angular/core';
import { LikedItem } from '../../model/liked-item';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product/product';
import { map } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  wishlist: LikedItem[] = [];
  constructor(
    private appService: AppService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    const wishlist = this.appService.getWishlist();
    if (wishlist.length) {
      wishlist.forEach((i) => {
        const itemData = `${i}`.split('-');
        this.productService.getProductById(+itemData[0]).subscribe((p) => {
          const likedItem: LikedItem = {
            item: i,
            product: p,
            color: itemData[1],
            variant: itemData[2],
          };
          this.wishlist.push(likedItem);
        });
      });
    }
  }

  removeFromWishlist(item: string) {
    this.appService.removeFromWishlist(item);
    const update = this.wishlist.filter((i) => i.item !== item);
    this.wishlist = update;
  }
  clearWishlist() {
    this.wishlist = [];
    this.appService.clearWishlist();
  }
}
