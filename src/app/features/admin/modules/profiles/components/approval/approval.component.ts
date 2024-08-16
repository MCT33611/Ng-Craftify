import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { EmailDialogComponent } from '../../../../../../shared/components/email-dialog/email-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from '../../../../../../models/iuser';

@Component({
  selector: 'app-approval',
  template: ''
})
export class ApprovalComponent implements OnInit, OnDestroy {
  private _accessChangeSubscription: Subscription | undefined;
  private user? : IUser
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.approvalChange();
  }

  ngOnDestroy() {
    this._accessChangeSubscription?.unsubscribe();
  }

  async approvalChange() {
    const confirmation = await this._alertService.confirm("worker approval", "Are you sure you want to change the approval of this worker?");
    if (confirmation) {
      this._route.paramMap.subscribe(async params => {
        const userId = params.get('id');
        if (userId) {
          this.user = await this._userService.get(userId).toPromise();
          if(this.user && this.user?.email)
            this.openEmailDialog(userId,this.user?.email);
        } else {
          this._alertService.error("User ID not found");
        }
      });
    } else {
      this._alertService.error("Confirmation denied");
      this._router.navigate(['/admin/profiles']);
    }
  }

  openEmailDialog(userId:string,email : string) {
    // Open the email dialog
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      data: { email: email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._alertService.success('Email sent successfully');
        // Proceed with the approval change
        this._accessChangeSubscription = this._userService.ApprovalChange(userId)
          .subscribe({
            complete: () => {
              this._alertService.success("Worker approval changed successfully");
              this._router.navigate(['/admin/profiles/worker-list']);
            },
            error: (err) => {
              this._alertService.error(err.error?.title || 'An error occurred while changing worker approval');
            }
          });
      } else {
        this._alertService.error('Email sending cancelled');
        setTimeout(() => this._router.navigate(['/admin/profiles']), 3000);
      }
    });
  }
}
