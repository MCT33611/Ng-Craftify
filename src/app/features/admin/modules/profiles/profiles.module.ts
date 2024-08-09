import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UiDatatableComponent } from '../../../../shared/components/ui-datatable/ui-datatable.component';
import { UiUpsertFormComponent } from '../../../../shared/components/ui-upsert-form/ui-upsert-form.component';
import { WorkersListComponent } from './components/workers-list/workers-list.component';
import { RouterLink } from '@angular/router';
import { WorkerDetailsComponent } from './components/worker-details/worker-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ImageSliderComponent } from '../../../../shared/components/image-slider/image-slider';


@NgModule({
  declarations: [
    UsersListComponent,
    UserDetailsComponent,
    WorkersListComponent,
    WorkerDetailsComponent
  ],
  imports: [
    CommonModule,
    ProfilesRoutingModule,
    UiDatatableComponent,
    UiUpsertFormComponent,
    RouterLink,
    PdfViewerModule,
    ImageSliderComponent
  ]
})
export class ProfilesModule { }
