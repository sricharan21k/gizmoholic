import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../model/review/review';
import { ReviewRequest } from '../model/review/review-request';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiBaseUrl = 'http://localhost:8080/reviews';

  constructor(private http: HttpClient) {}

  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiBaseUrl}/product/${productId}`);
  }

  getReviewReplies(reviewId: number): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.apiBaseUrl}/review/${reviewId}/replies`
    );
  }

  updateReview(request: ReviewRequest, reviewId: number): Observable<Review> {
    return this.http.patch<Review>(
      `${this.apiBaseUrl}/product/${reviewId}`,
      request
    );
  }

  likeReview(reviewId: number): Observable<number> {
    return this.http.patch<number>(`${this.apiBaseUrl}/like/${reviewId}`, {});
  }
}
