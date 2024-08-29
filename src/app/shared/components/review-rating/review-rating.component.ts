import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ReviewRatingService } from '../../../services/review-rating.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingDotsComponent } from '../loading-dots/loading-dots.component';

interface Review {
  id: string;
  comment: string;
  createdAt: Date;
  rating: Rating;
}

interface Rating {
  overallScore: number;
  punctualityScore: number;
  professionalismScore: number;
  qualityScore: number;
}

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
}

@Component({
  selector: 'app-review-rating',
  standalone: true,
  imports: [IonicModule, MaterialModule, CommonModule, LoadingDotsComponent],
  templateUrl: './review-rating.component.html',
  styleUrls: ['./review-rating.component.css'],
})
export class ReviewRatingComponent implements OnInit, OnDestroy {
  @Input() providerId!: string;
  reviews: any[] = [];
  averageRating: number = 0;
  private subscriptions: Subscription = new Subscription();
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewRatingService
  ) {}

  ngOnInit() {
    if (!this.providerId) {
      const routeSubscription = this.route.params.subscribe((params) => {
        this.providerId = params['Id'];
        this.loadReviews();
      });
      this.subscriptions.add(routeSubscription);
    } else {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.isLoading = true;

    const reviewsSubscription = this.reviewService
      .getReviewsByProviderId(this.providerId)
      .subscribe({
        next: (data: any) => {
          this.reviews = data.reviews.$values;
          this.averageRating = data.averageRating;
        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
          this.isLoading = false
        },
        complete:()=> this.isLoading = false
      });
    this.subscriptions.add(reviewsSubscription);
  }

  getStarRating(rating: number): {
    filled: number;
    half: number;
    empty: number;
  } {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
    return {
      filled: filledStars,
      half: hasHalfStar ? 1 : 0,
      empty: emptyStars,
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
