import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { PlanService } from '../../services/plan.service';
import { IPlan } from '../../../../../../models/iplan';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit, OnDestroy {
  private planService = inject(PlanService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);

  data: IPlan = {};
  labels: string[] = ['title', 'price', 'duration', 'description'];
  private planId: string | null = null;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          this.planId = params.get('id');
          if (!this.planId) {
            throw new Error('Id is not valid');
          }
          return this.planService.get(this.planId);
        })
      )
      .subscribe({
        next: (res) => {
          this.data = res;
        },
        error: (error: Error | HttpErrorResponse) => {
          this.alertService.error(
            error instanceof HttpErrorResponse
              ? error.error.title
              : error.message
          );
        },
      });
  }

  handleFormSubmit(data: IPlan) {
    if (!this.planId) {
      this.alertService.error('Id is not valid');
      return;
    }

    this.planService
      .update(this.planId, {
        id: this.planId,
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertService.success('Plan updated successfully');
          this.router.navigate(['/plans']); // Assuming you want to navigate after update
        },
        error: (err: HttpErrorResponse) =>
          this.alertService.error(err.error.title ?? 'An error occurred'),
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
