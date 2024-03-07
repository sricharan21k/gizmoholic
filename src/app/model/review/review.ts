export interface Review {
  id: number;
  rating: number;
  content: string;
  posted: Date;
  lastUpdated: Date;
  likes: number;
}
