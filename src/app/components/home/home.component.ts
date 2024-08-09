import { AfterContentInit, AfterViewInit, Component, OnChanges, OnInit, Query, SimpleChanges, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileStore } from '../../shared/store/profile.store';
import { ProfileService } from '../../features/profile/services/profile.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router = inject(Router);
  searchTerm = '';
  onSearch() {
    if (this.searchTerm)
      this.router.navigate(['/customer/services'], { queryParams: { search: this.searchTerm } });
  }
}
