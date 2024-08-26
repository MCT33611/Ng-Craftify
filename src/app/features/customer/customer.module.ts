import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SidePopupComponent } from './components/side-popup/side-popup.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { MaterialModule } from '../../shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceCardTwoComponent } from '../../shared/components/service-card-two/service-card-two.component';
import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { ReviewDialogComponent } from './components/review-dialog/review-dialog.component';
import { ReviewRatingComponent } from '../../shared/components/review-rating/review-rating.component';
import { LoadingDotsComponent } from '../../shared/components/loading-dots/loading-dots.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    SidePopupComponent,
    ServiceListComponent,
    ServiceDetailsComponent,
    BookingFormComponent,
    RequestListComponent,
    ReviewDialogComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    RouterOutlet,
    RouterLink,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceCardTwoComponent,
    ServiceCardComponent,
    ReviewRatingComponent,
    LoadingDotsComponent
  ]
})
export class CustomerModule { }
