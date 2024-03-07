import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../model/cart-item';
import { AppService } from '../../services/app.service';
import { LikedItem } from '../../model/liked-item';
import { Review } from '../../model/review/review';
import { ReviewService } from '../../services/review.service';
import { ProductReviewComponent } from '../product-review/product-review.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  imports: [CommonModule, RouterModule, ProductReviewComponent],
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity: number = 1;
  isLiked: boolean = false;
  colorImage: [string, string] = ['', ''];
  variantPrice: [string, number] = ['', 0];
  wishlist: string[] = [];
  reviews: Review[] = [];
  item: string = '';
  showSuccessToast: boolean = false;
  showFailureToast: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private appService: AppService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +(params.get('id') as string);
      this.productService.getProductById(id).subscribe((data) => {
        this.product = data;

        this.reviewService
          .getProductReviews(id)
          .subscribe((data) => (this.reviews = data));

        this.route.queryParamMap.subscribe((params) => {
          const color = params.get('color') as string;
          const variant = params.get('variant') as string;
          this.colorImage = [color, this.product?.colors.get(color) ?? ''];
          this.variantPrice = [
            variant,
            this.product?.variants.get(variant) ?? 0,
          ];
          this.wishlist = this.appService.getWishlist();
        });
      });
    });
  }

  addToCart(item?: Product, color?: string, variant?: string) {
    if (item) {
      const currentId = this.cartService.getCartItemId();
      let newId = currentId ? currentId + 1 : 1;
      const newCartItem: CartItem = {
        id: newId,
        item: item,
        color: color as string,
        variant: variant as string,
        quantity: this.quantity,
        itemValue:
          (item.variants.get(variant as string) as number) * this.quantity,
      };
      this.cartService.addItemToCart(newCartItem);
      this.router.navigate(['/cart']);
    }
  }
  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    this.quantity--;
  }

  toggleWishlistItem() {
    const itemFound = this.wishlist.includes(this.getItem());
    console.log(itemFound);
    if (!itemFound) {
      this.addToWishlist();
    } else {
      this.removeFromWishlist();
    }
  }

  addToWishlist() {
    this.wishlist = [...this.wishlist, this.getItem()];
    this.appService.addToWishlist(this.getItem());
    this.showSuccessToast = true;
    this.dismissSuccessToast();
  }

  removeFromWishlist() {
    const update = this.wishlist.filter((i) => i !== this.getItem());
    this.wishlist = update;
    this.appService.removeFromWishlist(this.getItem());
    this.showFailureToast = true;
    this.dismissFailureToast();
  }

  updateVariant(variant: string, price: number) {
    this.variantPrice[0] = variant;
    this.variantPrice[1] = price;
  }
  updateColor(color: string, image: string) {
    this.colorImage[0] = color;
    this.colorImage[1] = image;
  }

  checkLikedItem() {
    return this.wishlist.includes(this.getItem());
  }

  getItem(): string {
    return `${this.product?.id}-${this.colorImage[0]}-${this.variantPrice[0]}`;
  }

  likeReview(reviewId: number) {
    this.reviewService
      .likeReview(reviewId)
      .subscribe((data) => console.log('like count', data));
  }

  dismissSuccessToast() {
    setTimeout(() => (this.showSuccessToast = false), 1000);
  }
  dismissFailureToast() {
    setTimeout(() => (this.showFailureToast = false), 1000);
  }

  toPascalCase(str: string): string {
    let pascalCaseWords: string[] = [];
    if (/^\d/.test(str)) {
      return str.toUpperCase();
    }
    if (str) {
      const words = str.split(' ');
      pascalCaseWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    }
    return pascalCaseWords.join(' ');
  }
}
