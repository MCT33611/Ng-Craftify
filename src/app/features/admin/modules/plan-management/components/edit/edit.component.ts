import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { PlanService } from '../../services/plan.service';
import { IPlan } from '../../../../../../models/iplan';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit, OnDestroy {
  planService = inject(PlanService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  alertService = inject(AlertService);
  data: IPlan = {};
  labels: string[] = [
    'title',
    'price',
    'duration',
    'description'
  ];
  planId!: string | null;
  
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.planId = params.get('id');
      
      if (this.planId) {
        this.planService.get(this.planId).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res) => {
            this.data = res;
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.error(error.error.title);
          }
        });
      } else {
        this.alertService.error("Id is not valid");
      }
    });
  }

  handleFormSubmit(data: IPlan) {
    console.log('Form submitted:', data);
    if (this.planId) {
      this.planService.update(
        this.planId,
        {
          id: this.planId,
          title: data.title,
          description: data.description,
          price: data.price,
          duration: data.duration
        }
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        complete: () => this.alertService.success("plan updated successfully"),
        error: (err: HttpErrorResponse) => this.alertService.error(err.error.title)
      });
    } else {
      this.alertService.error("Id is not valid");
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}