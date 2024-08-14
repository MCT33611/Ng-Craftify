import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { PlanManagementModule } from './modules/plan-management/plan-management.module';
import { RequestManagementModule } from './modules/request-management/request-management.module';

const routes: Routes = [
  {
    path:"",
    component:LayoutComponent,
    children:[
      {
        path:"",
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path:"dashboard",
        component:DashboardComponent
      },
      {
        path:"profiles",
        loadChildren:()=> ProfilesModule
      },     
      {
        path:"plan",
        loadChildren:()=> PlanManagementModule
      },
      {
        path:"request",
        loadChildren:()=> RequestManagementModule
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
