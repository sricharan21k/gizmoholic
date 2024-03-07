export interface ReviewRequest {
  reviewId: number;
  userId: number;
  productId: number;
  rating: number;
  content: string;
}
