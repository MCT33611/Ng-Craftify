import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { IWorker } from '../../../../models/iworker';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../../../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {
  private _customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);

  worker!: IWorker;
  showBookingForm = false;
  showReviews = false;

  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((res) => {
        const workerId = res['workerId'];
        this.subscriptions.add(
          this._customerService.getWorker(workerId).subscribe({
            next: (res: IWorker) => {
              this.worker = res;
            },
            error: (err: HttpErrorResponse) => {
              this.alert.error(err.status + ' : ' + err.message);
            },
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
