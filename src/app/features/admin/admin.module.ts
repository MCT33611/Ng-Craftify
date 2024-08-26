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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportsComponent } from './components/reports/reports.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { LoadingDotsComponent } from '../../shared/components/loading-dots/loading-dots.component';
@NgModule({
  declarations: [
    LayoutComponent,
    ContentComponent,
    DashboardComponent,
    ReportsComponent
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
    NgxChartsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingDotsComponent
  ]
})
export class AdminModule { }
