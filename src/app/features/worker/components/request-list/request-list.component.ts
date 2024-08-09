import { Component } from '@angular/core';
import { IBooking } from '../../../../models/ibooking';
import { WorkerService } from '../../services/worker.service';
import { IBookingStatus } from '../../../../models/ibooking-status';
import { Router } from '@angular/router';
import { getRoomId } from '../../../../shared/utils/getRoomId';
import { AlertService } from '../../../../services/alert.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatService } from '../../../chat/services/chat.service';
import { IApiResponse } from '../../../../models/api-response.models';
import { TaskCompletionDialogComponent } from '../task-completion-dialog/task-completion-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.css'
})
export class RequestListComponent {
  bookings: IBooking[] = [];

  constructor(
    private workerService: WorkerService,
    private chatService:ChatService,
    private _alert : AlertService,
    private router : Router,
    public dialog: MatDialog,
    private token:TokenService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  openTaskCompletionDialog(booking:IBooking) {
    const dialogRef = this.dialog.open(TaskCompletionDialogComponent, {
      width: '400px',
      data: { email: booking.customer?.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
      if (result) {
        this.completeBooking(booking);
      }
    });
  }

  getBookingStatus(status: number) {
    return IBookingStatus[status]
  }

  isDatePassed(dateString: string): boolean {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate < today;
  }

  cancelBooking(booking : IBooking): void {
    booking.status = IBookingStatus.Cancelled;
    this.workerService.rescheduleBooking(booking).subscribe({
    });
  }

  loadBookings(): void {
    this.workerService.getAllRequest().subscribe({
      next:(data: IApiResponse< IBooking>) => {
        console.log(data);
        
        this.bookings = data.$values;
      },
      error:(error) => {
        console.error('Error fetching bookings:', error);
      }
    });
  }

  getGoogleMapsUrl(location: string): string {
    const [lat, lng] = location.split(',');
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  acceptBooking(booking:IBooking): void {
    console.log('Accepting booking:', booking);
    booking.status = IBookingStatus.Accepted;
    this.workerService.rescheduleBooking(booking).subscribe({
    });
  }

  completeBooking(booking:IBooking): void {
    booking.status = IBookingStatus.Completed;
    this.workerService.rescheduleBooking(booking).subscribe({
    });
  }

  rejectBooking(booking:IBooking): void {
    console.log('Rejecting booking:', booking);
    booking.status = IBookingStatus.Rejected;
    this.workerService.rescheduleBooking(booking).subscribe({
    });
  }

  startMessage(booking: IBooking) {
    const providerId = this.token.getUserId();
    const customerId = booking.customerId;

    if (!providerId || !customerId) {
      this._alert.error("Invalid provider or customer ID");
      return;
    }
    this.chatService.createConversation(providerId, customerId).subscribe({
      complete:()=>{
        this._alert.success("succuss fully create a converstion");
        this.router.navigate(['/worker/chat']);
      },
      error:(err) => {
        this._alert.error(err.status);
      }
    });
  }

}

