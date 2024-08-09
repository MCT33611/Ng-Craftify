// layout.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidePopupType: 'search' | 'notifications' | null = null;

  toggleSidePopup(type: 'search' | 'notifications' | null) {
    this.sidePopupType = this.sidePopupType === type ? null : type;
  }

  closeSidePopup() {
    this.sidePopupType = null;
  }
}