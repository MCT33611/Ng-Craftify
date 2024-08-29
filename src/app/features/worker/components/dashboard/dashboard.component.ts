import { Component, OnInit, OnDestroy } from '@angular/core';
import { inject } from '@angular/core';
import { IBooking } from '../../../../models/ibooking';
import { DashbaordService } from './dashbaord.service';
import { IBookingStatus } from '../../../../models/ibooking-status';
import { IApiResponse } from '../../../../models/api-response.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  bookings: IBooking[] = [];
  completedTaskCount = 0;
  bookingPieChartData: any[] = [];
  isLoading = false;

  private _service = inject(DashbaordService);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchData(): void {
    this.isLoading = true;
    this.subscription.add(
      this._service.getAllBookings().subscribe({
        next: (res: IApiResponse<IBooking>) => {
          this.bookings = res.$values;
          console.log(this.bookings);

          this.completedTaskCount = this.bookings.filter(
            (b) => b.status === IBookingStatus.Completed
          ).length;
          this.prepareBookingChartData();
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
          this.isLoading = false
        },
        complete:()=> this.isLoading = false
      })
    );
  }

  prepareBookingChartData(): void {
    const statusCounts = new Map<string, number>();

    this.bookings.forEach((booking) => {
      let statusName: string;
      switch (booking.status) {
        case IBookingStatus.Pending:
          statusName = 'Pending';
          break;
        case IBookingStatus.Rejected:
          statusName = 'Rejected';
          break;
        case IBookingStatus.Accepted:
          statusName = 'Accepted';
          break;
        case IBookingStatus.Completed:
          statusName = 'Completed';
          break;
        case IBookingStatus.Cancelled:
          statusName = 'Cancelled';
          break;
        default:
          statusName = 'Unknown';
      }

      statusCounts.set(statusName, (statusCounts.get(statusName) || 0) + 1);
    });

    this.bookingPieChartData = Array.from(statusCounts, ([name, value]) => ({
      name,
      value,
    }));
  }
}
