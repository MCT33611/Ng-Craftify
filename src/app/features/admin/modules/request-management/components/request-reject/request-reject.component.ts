import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { RequestService } from '../../services/request.service';
import { IBooking } from '../../../../../../models/ibooking';
import { IBookingStatus } from '../../../../../../models/ibooking-status';
import { EmailDialogComponent } from '../../../../../../shared/components/email-dialog/email-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-request-reject',
  template: ''
})
export class RequestRejectComponent implements OnInit {
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

  async reject() {
    const confirmation = await this._alertService.confirm("Reject this Request", "Are you sure you want to reject this request?");
    if (confirmation) {
      const requestId = this._route.snapshot.paramMap.get('id');
      if (requestId) {
        try {
          const requestDetails = await this._requestService.getRequest(requestId).toPromise();
          if (requestDetails) {
            requestDetails.status = IBookingStatus.Rejected;
            // Open the email dialog before proceeding
            this.openEmailDialog(requestDetails);
          } else {
            throw new Error("Request details not found");
          }
        } catch (err: any) {
          this._alertService.error(err.error?.title || 'An error occurred while rejecting the service request');
          this._router.navigate(['/admin/request']);
        }
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
    // Open the email dialog
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      data: { email: requestDetails.customer?.email } // Assuming requestDetails has a customerEmail property
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._alertService.success('Email sent successfully');
        this._requestService.rescheduleBooking(requestDetails).toPromise().then(() => {
          this._alertService.success("Request rejected successfully");
          this._router.navigate(['/admin/request']);
        }).catch(err => {
          this._alertService.error(err.error?.title || 'An error occurred while rejecting the service request');
        });
      } else {
        this._alertService.error('Email sending cancelled');
        setTimeout(() => this._router.navigate(['/admin/request']), 3000);
      }
    });
  }
}
