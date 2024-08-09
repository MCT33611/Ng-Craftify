import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestManagementRoutingModule } from './request-management-routing.module';
import { RequestListComponent } from './components/request-list/request-list.component';
import { UiDatatableComponent } from '../../../../shared/components/ui-datatable/ui-datatable.component';
import { RequestRejectComponent } from './components/request-reject/request-reject.component';


@NgModule({
  declarations: [
    RequestListComponent,
    RequestRejectComponent
  ],
  imports: [
    CommonModule,
    RequestManagementRoutingModule,
    UiDatatableComponent
  ]
})
export class RequestManagementModule { }
