import { AfterContentInit, AfterViewInit, Component, OnChanges, OnInit, Query, SimpleChanges, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmailDialogComponent } from '../../shared/components/email-dialog/email-dialog.component';
import { LoadingDotsComponent } from '../../shared/components/loading-dots/loading-dots.component';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    LoadingDotsComponent
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
