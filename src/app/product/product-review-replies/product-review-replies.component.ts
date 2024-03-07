import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Review } from '../../model/review/review';

@Component({
  selector: 'app-product-review-replies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-review-replies.component.html',
  styleUrl: './product-review-replies.component.css',
})
export class ProductReviewRepliesComponent {
  @Input()
  review?: Review;
  @Input()
  replies: Review[] = [];

  @Output()
  showReview = new EventEmitter<boolean>();
  constructor() {
    console.log('replies comp', this.replies);
  }

  hideReplies() {
    this.showReview.emit(true);
  }
}
