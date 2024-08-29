export interface CreateReviewCommand {
    bookingId: string;
    customerId: string;
    providerId: string;
    comment: string;
    rating: CreateRatingCommand;
  }
  
  export interface CreateRatingCommand {
    overallScore: number;
    punctualityScore: number;
    professionalismScore: number;
    qualityScore: number;
  }
  
  export interface CreateReviewResult {
    id: string;
    bookingId: string;
    customerId: string;
    providerId: string;
    comment: string;
    createdAt: string;
  }

  export interface ReviewWithRating {
    id: string;
    bookingId: string;
    customerId: string;
    providerId: string;
    comment: string;
    createdAt: string;
    rating: {
      overallScore: number;
      punctualityScore: number;
      professionalismScore: number;
      qualityScore: number;
    };
  }
  
  export interface ReviewsWithRatingsVm {
    reviews: ReviewWithRating[];
  }

  export interface ProviderReview {
    id: string;
    bookingId: string;
    customerId: string;
    providerId: string;
    comment: string;
    createdAt: string;
    rating: {
      overallScore: number;
      punctualityScore: number;
      professionalismScore: number;
      qualityScore: number;
    };
  }
  
  export interface ProviderReviewsVm {
    reviews: ProviderReview[];
  }

  export interface ProviderAverageRatingVm {
    providerId: string;
    averageRating: number;
    reviewCount: number;
  }

  