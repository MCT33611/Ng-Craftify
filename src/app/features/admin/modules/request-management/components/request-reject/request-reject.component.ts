import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { RequestService } from '../../services/request.service';
import { IBooking } from '../../../../../../models/ibooking';
import { IBookingStatus } from '../../../../../../models/ibooking-status';
import { EmailDialogComponent } from '../../../../../../shared/components/email-dialog/email-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-request-reject',
  template: ''
})
export class RequestRejectComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _requestService: RequestService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.reject();
  }

  ngOnDestroy() {
    // Emit to unsubscribe all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  async reject() {
    const confirmation = await this._alertService.confirm("Reject this Request", "Are you sure you want to reject this request?");
    if (confirmation) {
      const requestId = this._route.snapshot.paramMap.get('id');
      if (requestId) {
        this._requestService.getRequest(requestId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            requestDetails => {
              if (requestDetails) {
                requestDetails.status = IBookingStatus.Rejected;
                // Open the email dialog before proceeding
                this.openEmailDialog(requestDetails);
              } else {
                this._alertService.error("Request details not found");
                this._router.navigate(['/admin/request']);
              }
            },
            err => {
              this._alertService.error(err.error?.title || 'An error occurred while rejecting the service request');
              this._router.navigate(['/admin/request']);
            }
          );
      } else {
        this._alertService.error("Booking ID is not found");
        this._router.navigate(['/admin/request']);
      }
    } else {
      this._alertService.error("Confirmation denied");
      this._router.navigate(['/admin/request']);
    }
  }

  openEmailDialog(requestDetails: IBooking) {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      data: { email: requestDetails.customer?.email }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result) {
          this._alertService.success('Email sent successfully');
          this._requestService.rescheduleBooking(requestDetails)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              () => {
                this._alertService.success("Request rejected successfully");
                this._router.navigate(['/admin/request']);
              },
              err => {
                this._alertService.error(err.error?.title || 'An error occurred while rejecting the service request');
              }
            );
        } else {
          this._alertService.error('Email sending cancelled');
          setTimeout(() => this._router.navigate(['/admin/request']), 3000);
        }
      });
  }
}
