import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { CreateComponent } from './components/create/create.component';
import { UiDatatableComponent } from '../../../../shared/components/ui-datatable/ui-datatable.component';
import { UiUpsertFormComponent } from '../../../../shared/components/ui-upsert-form/ui-upsert-form.component';
import { RouterLink } from '@angular/router';
import { PlanManagementRoutingModule } from './plan-management-routing.module';


@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    PlanManagementRoutingModule,
    UiDatatableComponent,
    UiUpsertFormComponent,
    RouterLink
  ]
})
export class PlanManagementModule { }
