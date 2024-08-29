import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private _alertService = inject(AlertService);
  private _loading = inject(LoadingService);

  private subscriptions: Subscription = new Subscription();
  sidePopupType: 'search' | 'notifications' | null = null;

  constructor() {
    this._loading.hide();
  }

  ngOnInit(): void {
    setTimeout(() => this.notificationService.joinUserGroup(), 3000);
    setTimeout(() => this.initializeNotifications(), 4000);
  }

  private initializeNotifications(): void {
    this.subscriptions.add(
      this.notificationService.getUnreadNotifications().subscribe({
        next: (res) => {
          res.$values.forEach((note) => {
            this._alertService.notification(note);
            this.subscriptions.add(
              this.notificationService.markAsRead(note.id).subscribe({
                error: (error) => console.error(error),
              })
            );
          });
        },
      })
    );

    this.subscriptions.add(
      this.notificationService.getNotifications().subscribe({
        next: (res) => {
          res.forEach((note) => {
            this._alertService.notification(note);
            console.log(note.id);
            this.subscriptions.add(
              this.notificationService.markAsRead(note.id).subscribe({
                error: (error) => console.error(error),
              })
            );
            console.log('marked2');
          });
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.notificationService.leave();
    this.subscriptions.unsubscribe();
  }

  toggleSidePopup(type: 'search' | 'notifications' | null) {
    this.sidePopupType = this.sidePopupType === type ? null : type;
  }

  closeSidePopup() {
    this.sidePopupType = null;
  }
}
