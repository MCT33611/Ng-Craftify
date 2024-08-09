// sidebar.component.ts
import { Component, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../authentication/services/auth.service';
import { Router } from '@angular/router';
import { ProfileStore } from '../../../../shared/store/profile.store';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TokenService } from '../../../../services/token.service';

interface MenuItem {
  icon: string;
  label: string;
  action: 'search' | 'notifications' | null;
  active: boolean;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  authService = inject(AuthService);
  token = inject(TokenService);
  router = inject(Router);
  _profileStore = inject(ProfileStore);
  @Output() toggleSidePopup = new EventEmitter<'search' | 'notifications' | null>();
  isExpanded = true;
  userId = this.token.getUserId();
  menuItems: MenuItem[] = [
    { icon: 'home', label: 'Home', action: null, active: true, route: './home' },
    //{ icon: 'search', label: 'Search', action: 'search', active: false },
    //{ icon: 'notifications', label: 'Notifications', action: 'notifications', active: false },
    { icon: 'chatbubbles', label: 'Messages', action: null, active: false ,route:`./chat`},
    { icon: 'briefcase', label: 'Services', action: null, active: false, route: './services' },
    { icon: 'git-pull-request', label: 'Requests', action: null, active: false, route: './requests' },
    { icon: 'person', label: 'Profile', action: null, active: false, route: './profile' },
  ];

  private destroy$ = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.breakpointObserver
      .observe([
        Breakpoints.Medium,
        Breakpoints.Large,
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.Medium]) {
            this.isExpanded = false;
          } else if (result.breakpoints[Breakpoints.Large]) {
            this.isExpanded = true;
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isMobileHiddenItem(item: MenuItem): boolean {
    return window.innerWidth < 768 && (item.label === 'Notifications' || item.label === 'Search');
  }

  onMenuItemClick(action: 'search' | 'notifications' | null) {
    if (action === 'search' || action === 'notifications') {
      this.toggleSidePopup.emit(action);
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    document.querySelector('app-sidebar')?.classList.toggle('expanded');
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/sign-in']);
  }

}