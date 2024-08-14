import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MaterialModule } from '../../shared/material/material.module';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ContentComponent } from './components/content/content.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UiDatatableComponent } from '../../shared/components/ui-datatable/ui-datatable.component';
import { UiUpsertFormComponent } from '../../shared/components/ui-upsert-form/ui-upsert-form.component';


@NgModule({
  declarations: [
    LayoutComponent,
    ContentComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HeaderComponent,
    FooterComponent,
    MaterialModule,
    RouterOutlet,
    RouterLink,
    UiDatatableComponent,
    UiUpsertFormComponent,
    SidebarComponent,
  ]
})
export class AdminModule { }
