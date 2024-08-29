import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { AlertService } from '../../../../../../services/alert.service';
import { ColumnConfig, ColumnType } from '../../../../../../shared/components/ui-datatable/column-config.model';
import { IBooking } from '../../../../../../models/ibooking';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { IBookingStatus } from '../../../../../../models/ibooking-status';
import { getFullDateFromString } from '../../../../../../shared/utils/getFullDateFromString';
import { LoadingService } from '../../../../../../services/loading.service';

interface BookingResponse {
  $values?: IBooking[];
}

interface ProcessedBooking extends Omit<IBooking, 'status'> {
  date: string;
  locationName: string;
  status: string;
  customerName: string;
  providerName: string;
  action?: string;
}

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit, OnDestroy {
  private requestService = inject(RequestService);
  private alertService = inject(AlertService);
  private _loading = inject(LoadingService)

  data: ProcessedBooking[] = [];
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
  constructor(){
    this._loading.hide();
  }

  ngOnInit(): void {
    this.fetchBookings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchBookings(): void {
    this.requestService.getAllRequest().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: BookingResponse | IBooking[]) => {
        if (this.isBookingResponse(res) && Array.isArray(res.$values)) {
          this.processBookings(res.$values);
        } else if (Array.isArray(res)) {
          this.processBookings(res);
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

  private isBookingResponse(res: BookingResponse | IBooking[]): res is BookingResponse {
    return '$values' in res;
  }

  private processBookings(bookings: IBooking[]): void {
    this.data = bookings.map(this.processBooking.bind(this));
    this.updateColumns();
  }

  private processBooking(booking: IBooking): ProcessedBooking {
    const { status, ...rest } = booking;
    const result: ProcessedBooking = {
      ...rest,
      date: getFullDateFromString(booking.bookedAt!),
      locationName: booking.locationName?.split(',')[5] || 'N/A',
      status: status !== undefined ? IBookingStatus[status] : 'Unknown',
      customerName: booking.customer?.firstName || 'N/A',
      providerName: booking.provider?.user?.firstName || 'N/A',
    };

    if (this.canRejectBooking(status)) {
      result.action = `/admin/request/reject/${booking.id}`;
    }

    return result;
  }

  private canRejectBooking(status: IBookingStatus | undefined): boolean {
    return status !== undefined &&
           status !== IBookingStatus.Cancelled &&
           status !== IBookingStatus.Completed &&
           status !== IBookingStatus.Rejected;
  }

  private updateColumns(): void {
    const hasRejectableBookings = this.data.some(booking => 'action' in booking);
    if (!hasRejectableBookings) {
      this.columns = this.columns.filter(column => column.key !== 'action');
    }
  }
}