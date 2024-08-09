import { Component, computed, inject, OnInit } from '@angular/core';
import { IBooking } from '../../../../models/ibooking';
import { IUser } from '../../../../models/iuser';
import { IWorker } from '../../../../models/iworker';
import { DashbaordService } from './dashbaord.service';
import { IBookingStatus } from '../../../../models/ibooking-status';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  bookings:IBooking[] = []

  customers:IUser[] = []

  workers : IWorker[] = []

  subscriptions:[] = []

  completedTaskCount = 0;

  private _service = inject(DashbaordService)

  ngOnInit(): void {
    this._service.getAllBookings().subscribe({
      next:(res:any)=>{
        console.log(res);
        
        this.bookings = res.$values
        this.completedTaskCount = this.bookings.filter(b => b.status === IBookingStatus.Completed).length;
      }
    })

    this._service.getAllCustomers().subscribe({
      next:(res:any)=>{
        console.log(res);

        this.customers = res.$values
      }
    })

    this._service.getAllWorkers().subscribe({
      next:(res:any)=>{
        console.log(res);

        this.workers = res.$values
      }
    })
  }



}