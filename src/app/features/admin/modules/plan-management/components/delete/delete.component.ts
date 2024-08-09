import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete',
  template: ''
})
export class DeleteComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;

  constructor(
    private _planService: PlanService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    this.delete();
  }

  ngOnDestroy() {
    this.deleteSubscription?.unsubscribe();
  }

  async delete() {
    const confirmation = await this._alertService.confirm("Plan Delete", "Are you sure you want to delete this plan?");
    if (confirmation) {
      this.deleteSubscription = this._route.paramMap.subscribe(params => {
        const planId = params.get('id');
        if (planId) {
          this._planService.delete(planId)
            .subscribe({
              complete: () => {
                this._alertService.success("Plan deleted successfully");
                this._router.navigate(['/admin/plan']);
              },

              error: (err) => {
                this._alertService.error(err.error?.title || 'An error occurred while deleting the plan');
              }
            });
          } else {
            this._alertService.error("Plan Id is not found");
          }
        });
      } else {
        this._alertService.error("Confirmation denied");
        this._router.navigate(['/admin/plan']);
    }
  }
}
