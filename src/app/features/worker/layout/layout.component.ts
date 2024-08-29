import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ProfileStore } from '../../../shared/store/profile.store';
import { TokenService } from '../../../services/token.service';
import { NotificationService } from '../../../services/notification.service';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit, OnDestroy {
  profileStore = inject(ProfileStore);
  token = inject(TokenService);
  tokenService = inject(TokenService);
  notificationService = inject(NotificationService);
  private _alertService = inject(AlertService);

  private subscriptions: Subscription[] = [];

  menuItems = [
    {
      title: 'Dashboard',
      route: 'dashboard',
      iconSrc: 'assets/icons/dashboard.svg',
    },
    {
      title: 'Edit Images & Details ',
      route: 'images',
      iconSrc: 'assets/icons/images.svg',
    },
    {
      title: 'Bookings Management',
      route: 'requests',
      iconSrc: 'assets/icons/service.svg',
    },
    {
      title: 'Messages',
      route: 'chat',
      iconSrc: 'assets/icons/message.svg',
    },
    {
      title: 'Reviews and Ratings',
      route: `reviews/${this.tokenService.getWorkerId()}`,
      iconSrc: 'assets/icons/review.svg',
    },
    {
      title: 'Settings',
      route: 'settings',
      iconSrc: 'assets/icons/settings.svg',
    },
  ];

  constructor(private _loading: LoadingService) {
    _loading.hide();
  }

  ngOnInit(): void {
    this.profileStore.loadAll();
    setTimeout(() => this.notificationService.joinUserGroup(), 3000);
    setTimeout(() => {
      const unreadSub = this.notificationService
        .getUnreadNotifications()
        .subscribe({
          next: (res) => {
            res.$values.forEach((note) => {
              this._alertService.notification(note);
              this.notificationService.markAsRead(note.id);
            });
          },
        });
      this.subscriptions.push(unreadSub);

      const notificationsSub = this.notificationService
        .getNotifications()
        .subscribe({
          next: (res) => {
            res.forEach((note) => {
              this._alertService.notification(note);
              this.notificationService.markAsRead(note.id);
            });
          },
        });
      this.subscriptions.push(notificationsSub);
    }, 4000);
  }

  ngOnDestroy(): void {
    this.notificationService.leave();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
