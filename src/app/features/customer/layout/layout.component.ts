import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent  implements OnInit,OnDestroy{
  notificationService = inject(NotificationService);
  private _alertService = inject(AlertService);
  constructor() {}

  ngOnInit(): void {
    setTimeout(()=>this.notificationService.joinUserGroup(),3000)
    setTimeout(()=>{
      this.notificationService.getUnreadNotifications().subscribe({
        next: (res) => {
          console.log(res);
          res.$values.forEach(note => {
            this._alertService.notification(note);
            this.notificationService.markAsRead(note.id)
            console.log("marked1");
            
          })
        }
      })
      this.notificationService.getNotifications().subscribe({
        next: (res) => {
          res.forEach(note => {
            this._alertService.notification(note);
            this.notificationService.markAsRead(note.id)
            console.log("marked2");
  
          })
        }
      });
      
    },4000)
  }
  ngOnDestroy(): void {
    this.notificationService.leave()
  }
  sidePopupType: 'search' | 'notifications' | null = null;

  toggleSidePopup(type: 'search' | 'notifications' | null) {
    this.sidePopupType = this.sidePopupType === type ? null : type;
  }

  closeSidePopup() {
    this.sidePopupType = null;
  }
}