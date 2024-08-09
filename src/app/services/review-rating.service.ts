// review-rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewRatingService {
  private apiUrl = `${environment.API_BASE_URL}/api/ReviewRating`;

  constructor(private http: HttpClient) { }

  createReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/review`, reviewData);
  }
  getAllReviewWithRating(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getReviewsByProviderId(providerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider/${providerId}`);
  }

  getAverageRatingForProvider(providerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider/${providerId}/average-rating`);
  }

  getAllProviders(): Observable<any> {
    return this.http.get(`${environment.API_BASE_URL}/api/Profile/Workers`);
  }
}