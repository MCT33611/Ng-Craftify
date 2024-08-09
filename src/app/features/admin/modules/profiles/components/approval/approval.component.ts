import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-access',
  template: ''
})
export class approvalComponent implements OnInit, OnDestroy {
  private _accessChangeSubscription: Subscription | undefined;

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    this.approvalChange();
  }

  ngOnDestroy() {
    this._accessChangeSubscription?.unsubscribe();
  }

  async approvalChange() {
    const confirmation = await this._alertService.confirm("worker approval", "Are you sure you want to change approva of this worker?");
    if (confirmation) {
      this._accessChangeSubscription = this._route.paramMap.subscribe(params => {
        const userId = params.get('id');
        if (userId) {
          this._userService.ApprovalChange(userId)
            .subscribe({
              complete: () => {
                this._alertService.success("Worker approval changed successfully");
                this._router.navigate(['/admin/profiles/worker-list']);
              },

              error: (err) => {
                this._alertService.error(err.error?.title || 'An error occurred while deleting the plan');
              }
            });
          } else {
            this._alertService.error("user Id is not found");
          }
        });
      } else {
        this._alertService.error("Confirmation denied");
        this._router.navigate(['/admin/profiles']);
    }
  }
}
