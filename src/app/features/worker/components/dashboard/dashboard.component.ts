import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { CustomersListStore } from '../../../../shared/store/customers-list.store';
import { WorkersListStore } from '../../../../shared/store/workers-list.store';
import { IBooking } from '../../../../models/ibooking';
import { DashbaordService } from './dashbaord.service';
import { IBookingStatus } from '../../../../models/ibooking-status';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  bookings: IBooking[] = [];
  completedTaskCount = 0;
  bookingPieChartData: any[] = [];

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

    this.bookingPieChartData = Array.from(statusCounts, ([name, value]) => ({ name, value }));
  }
}