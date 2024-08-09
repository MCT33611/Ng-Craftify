import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { PlanService } from '../../services/plan.service';
import { IPlan } from '../../../../../../models/iplan';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnDestroy {
  planService = inject(PlanService)
  router = inject(Router)
  alertService = inject(AlertService)
  data: IPlan = {}
  labels: string[] = [
    'title',
    'price',
    'duration',
    'description'
  ];

  private destroy$ = new Subject<void>();

  handleFormSubmit(data: IPlan) {
    this.planService.create(
      {
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      complete: () => this.alertService.success("plan updated successfully"),
      error: (err: HttpErrorResponse) => this.alertService.error(err?.error?.title ?? err)
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}