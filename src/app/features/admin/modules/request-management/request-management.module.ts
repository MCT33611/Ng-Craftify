import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestManagementRoutingModule } from './request-management-routing.module';
import { RequestListComponent } from './components/request-list/request-list.component';
import { UiDatatableComponent } from '../../../../shared/components/ui-datatable/ui-datatable.component';
import { RequestRejectComponent } from './components/request-reject/request-reject.component';
import { DownloadAsExcelComponent } from '../../../../shared/components/download-as-excel/download-as-excel.component';
import { LoadingDotsComponent } from '../../../../shared/components/loading-dots/loading-dots.component';


@NgModule({
  declarations: [
    RequestListComponent,
    RequestRejectComponent
  ],
  imports: [
    CommonModule,
    RequestManagementRoutingModule,
    UiDatatableComponent,
    DownloadAsExcelComponent,
    LoadingDotsComponent
  ]
})
export class RequestManagementModule { }
