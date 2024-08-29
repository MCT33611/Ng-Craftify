import { Component, OnInit, OnDestroy } from '@angular/core';
import { inject } from '@angular/core';
import { IBooking } from '../../../../models/ibooking';
import { IUser } from '../../../../models/iuser';
import { IWorker } from '../../../../models/iworker';
import { DashbaordService } from './dashbaord.service';
import { IBookingStatus } from '../../../../models/ibooking-status';
import { Subscription } from 'rxjs';

interface ChartData {
  name: string;
  value: number;
}

interface ApiResponse<T> {
  $values: T[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  bookings: IBooking[] = [];
  customers: IUser[] = [];
  workers: IWorker[] = [];
  completedTaskCount = 0;

  // Chart data
  userPieChartData: ChartData[] = [];
  bookingBarChartData: ChartData[] = [];

  private _service = inject(DashbaordService);
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  fetchData(): void {
    this.subscriptions.push(
      this._service.getAllBookings().subscribe({
        next: (res: ApiResponse<IBooking>) => {
          this.bookings = res.$values;
          console.log(this.bookings);

          this.completedTaskCount = this.bookings.filter(
            (b) => b.status === IBookingStatus.Completed
          ).length;
          this.prepareBookingChartData();
        },
      })
    );

    this.subscriptions.push(
      this._service.getAllCustomers().subscribe({
        next: (res: ApiResponse<IUser>) => {
          this.customers = res.$values;
          this.updateUserPieChartData();
        },
      })
    );

    this.subscriptions.push(
      this._service.getAllWorkers().subscribe({
        next: (res: ApiResponse<IWorker>) => {
          this.workers = res.$values;
          this.updateUserPieChartData();
        },
      })
    );
  }

  updateUserPieChartData(): void {
    this.userPieChartData = [
      { name: 'Customers', value: this.customers.length },
      { name: 'Workers', value: this.workers.length },
    ];
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

    this.bookingBarChartData = Array.from(statusCounts, ([name, value]) => ({
      name,
      value,
    }));
  }
}
