import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkerRoutingModule } from './worker-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContentComponent } from './components/content/content.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../../shared/material/material.module';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ImageManagementComponent } from './components/image-management/image-management.component';
import { UploaderComponent } from '../../shared/components/uploader/uploader.component';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { EditServiceModalComponent } from './components/edit-service-modal/edit-service-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageSliderComponent } from '../../shared/components/image-slider/image-slider';
import { ServiceCardTwoComponent } from '../../shared/components/service-card-two/service-card-two.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { IonicModule } from '@ionic/angular';
import { TaskCompletionDialogComponent } from './components/task-completion-dialog/task-completion-dialog.component';
import { OtpComponent } from '../../shared/components/otp/otp.component';
import { ReviewRatingComponent } from '../../shared/components/review-rating/review-rating.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ContentComponent,
    ImageManagementComponent,
    LayoutComponent,
    EditServiceModalComponent,
    RequestListComponent,
    TaskCompletionDialogComponent,
  ],
  imports: [
    CommonModule,
    OtpComponent,
    SidebarComponent,
    WorkerRoutingModule,
    HeaderComponent,
    FooterComponent,
    MaterialModule,
    RouterOutlet,
    UploaderComponent,
    ServiceCardComponent,
    ReactiveFormsModule,
    FormsModule,
    ImageSliderComponent,
    ServiceCardTwoComponent,
    IonicModule,
  ]
})
export class WorkerModule { }
