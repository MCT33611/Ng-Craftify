import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateReviewCommand,
  CreateReviewResult,
  ReviewsWithRatingsVm,
  ProviderReviewsVm,
  ProviderAverageRatingVm,
} from '../models/review-rating.models';
import { IApiResponse } from '../models/api-response.models';
import { IWorker } from '../models/iworker';

@Injectable({
  providedIn: 'root',
})
export class ReviewRatingService {
  private apiUrl = `${environment.API_BASE_URL}/api/ReviewRating`;

  constructor(private http: HttpClient) {}

  createReview(
    reviewData: CreateReviewCommand
  ): Observable<CreateReviewResult> {
    return this.http.post<CreateReviewResult>(
      `${this.apiUrl}/review`,
      reviewData
    );
  }

  getAllReviewWithRating(): Observable<ReviewsWithRatingsVm> {
    return this.http.get<ReviewsWithRatingsVm>(`${this.apiUrl}/all`);
  }

  getReviewsByProviderId(providerId: string): Observable<ProviderReviewsVm> {
    return this.http.get<ProviderReviewsVm>(
      `${this.apiUrl}/provider/${providerId}`
    );
  }

  getAverageRatingForProvider(
    providerId: string
  ): Observable<ProviderAverageRatingVm> {
    return this.http.get<ProviderAverageRatingVm>(
      `${this.apiUrl}/provider/${providerId}/average-rating`
    );
  }
}
