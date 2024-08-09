
import { Component, OnInit, Input } from '@angular/core';
import { ReviewRatingService } from '../../../services/review-rating.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-rating',
  standalone:true,
  imports:[
    IonicModule,
    MaterialModule,
    CommonModule
  ],
  templateUrl: './review-rating.component.html',
  styleUrls: ['./review-rating.component.css']
})
export class ReviewRatingComponent implements OnInit {
  @Input() providerId!: string;
  reviews: any[] = [];
  averageRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewRatingService
  ) { }

  ngOnInit() {
    if (!this.providerId) {
      this.route.params.subscribe(params => {
        this.providerId = params['Id'];
        this.loadReviews();
      });
    }
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getReviewsByProviderId(this.providerId).subscribe({
      next: (data: any) => {

        
        this.reviews = data.reviews.$values;
        this.averageRating = data.averageRating;
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
      }
    });
  }

  getStarRating(rating: number): { filled: number, half: number, empty: number } {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
    return { filled: filledStars, half: hasHalfStar ? 1 : 0, empty: emptyStars };
  }
}