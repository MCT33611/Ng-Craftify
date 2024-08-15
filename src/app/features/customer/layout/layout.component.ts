import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  notificationService = inject(NotificationService);
  private _alertService = inject(AlertService);
  constructor() {
    this.notificationService.getUnreadNotifications().subscribe({
      next: (res) => {
        console.log(res);
        res.$values.forEach(note => {
          this._alertService.notification(note);
          this.notificationService.markAsRead(note.id)
        })
      }
    })
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        console.log(res);
        res.forEach(note => {
          this._alertService.notification(note);
          this.notificationService.markAsRead(note.id)
        })
      }
    });
  }
  sidePopupType: 'search' | 'notifications' | null = null;

  toggleSidePopup(type: 'search' | 'notifications' | null) {
    this.sidePopupType = this.sidePopupType === type ? null : type;
  }

  closeSidePopup() {
    this.sidePopupType = null;
  }
}