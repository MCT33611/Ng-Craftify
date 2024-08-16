import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { AlertService } from '../../../../../../services/alert.service';
import { ColumnConfig, ColumnType } from '../../../../../../shared/components/ui-datatable/column-config.model';
import { IBooking } from '../../../../../../models/ibooking';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { IBookingStatus } from '../../../../../../models/ibooking-status';
import { getFullDateFromString } from '../../../../../../shared/utils/getFullDateFromString';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit, OnDestroy {
  requestService = inject(RequestService);
  alertService = inject(AlertService);

  data: {}[] = [];
  columns: ColumnConfig[] = [
    { key: 'status', type: ColumnType.Text, header: 'Status' },
    { key: 'date', type: ColumnType.Text, header: 'Date' },
    { key: 'locationName', type: ColumnType.Text, header: 'Location' },
    { key: 'workingTime', type: ColumnType.Text, header: 'Working Time' },
    { key: 'customerName', type: ColumnType.Text, header: 'Customer' },
    { key: 'providerName', type: ColumnType.Text, header: 'Provider' },
    { key: 'action', type: ColumnType.Action, header: 'Reject' }
  ];

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.requestService.getAllRequest().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.$values)) {
          this.data = res.$values.map((booking: IBooking) => {
            let result: any = {
              ...booking,
              date: getFullDateFromString(booking?.bookedAt!),
              locationName: booking.locationName?.split(',')[5] || 'N/A',
              status: IBookingStatus[booking.status!] || 'Unknown',
              customerName: booking.customer?.firstName || 'N/A',
              providerName: booking.provider?.user?.firstName || 'N/A',
            };
            if (result.status !== IBookingStatus[IBookingStatus.Cancelled] &&
              result.status !== IBookingStatus[IBookingStatus.Completed] &&
              result.status !== IBookingStatus[IBookingStatus.Rejected]) {
              
              result['action'] = `/admin/request/reject/${booking.id}`;
              this.columns = this.columns.filter(ele => ele.key == 'action')
            }
            return result;
          });
        } else if (Array.isArray(res)) {
          this.data = res.map((booking: IBooking) => {
            let result: any = {
              ...booking,
              date: getFullDateFromString(booking?.bookedAt!),
              locationName: booking.locationName?.split(',')[5] || 'N/A',
              status: IBookingStatus[booking.status!] || 'Unknown',
              customerName: booking.customer?.firstName || 'N/A',
              providerName: booking.provider?.user?.firstName || 'N/A',
            };
            if (result.status !== IBookingStatus[IBookingStatus.Cancelled] &&
              result.status !== IBookingStatus[IBookingStatus.Completed] &&
              result.status !== IBookingStatus[IBookingStatus.Rejected]) {
              result['action'] = `/admin/request/reject/${booking.id}`;
              this.columns = this.columns.filter(ele => ele.key == 'action')
            }
            return result;
          });
        } else {
          console.error('Unexpected response format:', res);
          this.alertService.error('Unexpected response format from server');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(err.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}