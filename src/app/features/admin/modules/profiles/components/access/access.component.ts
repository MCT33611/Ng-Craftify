import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-access',
  template: ''
})
export class AccessComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    this.accessChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async accessChange() {
    const confirmation = await this._alertService.confirm("user access change", "Are you sure you want to change access of this user?");
    if (confirmation) {
      this._route.paramMap.pipe(
        takeUntil(this.destroy$)
      ).subscribe(params => {
        const userId = params.get('id');
        if (userId) {
          this._userService.AccessChange(userId).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            complete: () => {
              this._alertService.success("user access changed successfully");
              this._router.navigate(['/admin/profiles']);
            },
            error: (err) => {
              this._alertService.error(err.error?.title || 'An error occurred while changing user access');
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