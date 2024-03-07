import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';
import { Review } from '../../model/review/review';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { Product } from '../../model/product/product';
import { ProductService } from '../../services/product.service';
import { ProductReviewRepliesComponent } from '../product-review-replies/product-review-replies.component';

@Component({
  selector: 'app-product-review',
  standalone: true,
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css',
  imports: [CommonModule, RouterModule, ProductReviewRepliesComponent],
})
export class ProductReviewComponent implements OnInit {
  reviews: Review[] = [];
  showReplies: boolean = false;

  replies: Review[] = [];
  currentReview?: Review;

  @Input()
  product?: Product;

  constructor(
    private productService: ProductService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = +(params.get('id') as string);
      if (productId) {
        // this.productService
        //   .getProductById(productId)
        //   .subscribe((data) => (this.product = data));
        this.reviewService
          .getProductReviews(productId)
          .subscribe((data) => (this.reviews = data));
      }
    });
  }
  getReplies(review: Review) {
    this.showReplies = true;
    this.currentReview = review;

    // this.route.queryParams.subscribe((params) =>
    //   this.router.navigate(['replies', reviewId], {
    //     relativeTo: this.route,
    //     queryParams: { params },
    //   })
    // );
    this.reviewService.getReviewReplies(review.id).subscribe((data) => {
      this.replies = data;
      console.log('replies', this.replies);
    });
  }
  likeReview(reviewId: number) {}
  hideReplies(value: any) {
    this.showReplies = !value;
  }
}
