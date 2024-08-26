import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { IBooking } from '../../../../models/ibooking';
import { IUser } from '../../../../models/iuser';
import { IWorker } from '../../../../models/iworker';
import { DashbaordService } from './dashbaord.service';
import { IBookingStatus } from '../../../../models/ibooking-status';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  bookings: IBooking[] = [];
  customers: IUser[] = [];
  workers: IWorker[] = [];
  completedTaskCount = 0;

  // Chart data
  userPieChartData: any[] = [];
  bookingBarChartData: any[] = [];

  private _service = inject(DashbaordService);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this._service.getAllBookings().subscribe({
      next: (res: any) => {
        this.bookings = res.$values;
        console.log(this.bookings);
        
        this.completedTaskCount = this.bookings.filter(b => b.status === IBookingStatus.Completed).length;
        this.prepareBookingChartData();
      }
    });

    this._service.getAllCustomers().subscribe({
      next: (res: any) => {
        this.customers = res.$values;
        this.updateUserPieChartData();
      }
    });

    this._service.getAllWorkers().subscribe({
      next: (res: any) => {
        this.workers = res.$values;
        this.updateUserPieChartData();
      }
    });
  }

  updateUserPieChartData(): void {
    this.userPieChartData = [
      { name: 'Customers', value: this.customers.length },
      { name: 'Workers', value: this.workers.length }
    ];
  }

  prepareBookingChartData(): void {
    const statusCounts = new Map<string, number>();
    
    this.bookings.forEach(booking => {
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

    this.bookingBarChartData = Array.from(statusCounts, ([name, value]) => ({ name, value }));
}
}