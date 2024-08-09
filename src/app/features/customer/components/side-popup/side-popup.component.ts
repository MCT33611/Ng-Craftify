import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-popup',
  templateUrl: './side-popup.component.html',
  styleUrl: './side-popup.component.css'
})
export class SidePopupComponent {
  @Input() type: 'search' | 'notifications' = 'search';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
