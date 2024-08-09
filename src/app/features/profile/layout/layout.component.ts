import { Component, inject } from '@angular/core';
import { ProfileModule } from '../profile.module';
import { ProfileStore } from '../../../shared/store/profile.store';
import { IRoles } from '../../../core/constants/roles';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  profileStore = inject(ProfileStore);
  userRole = IRoles.Role_Customer;
}
