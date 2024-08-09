// review-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReviewRatingService } from '../../../../services/review-rating.service';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent {
  reviewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewRatingService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: string, providerId: string, customerId: string }
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', Validators.required],
      overallScore: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      punctualityScore: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      professionalismScore: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      qualityScore: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const reviewData = {
        ...this.reviewForm.value,
        bookingId: this.data.bookingId,
        providerId: this.data.providerId,
        customerId: this.data.customerId
      };
      this.reviewService.createReview(reviewData).subscribe({
        next:(result) => {
          this.dialogRef.close(result);
        },
        error:error => {
          console.error('Error submitting review:', error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}