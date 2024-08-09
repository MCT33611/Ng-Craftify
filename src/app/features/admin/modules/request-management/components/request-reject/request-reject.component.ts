import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { RequestService } from '../../services/request.service';
import { IBooking } from '../../../../../../models/ibooking';
import { IBookingStatus } from '../../../../../../models/ibooking-status';

@Component({
  selector: 'app-request-reject',
  template: ''
})
export class RequestRejectComponent implements OnInit {
  constructor(
    private _requestService: RequestService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService
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
            await this._requestService.rescheduleBooking(requestDetails).toPromise();
            this._alertService.success("Request rejected successfully");
            this._router.navigate(['/admin/request']);
          } else {
            throw new Error("Request details not found");
          }
        } catch (err:any) {
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
}