import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

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
        loadChildren:()=>import("./modules/profiles/profiles.module").then(m => m.ProfilesModule)
      },     
      {
        path:"plan",
        loadChildren:()=>import("./modules/plan-management/plan-management.module").then(m => m.PlanManagementModule)
      },
      {
        path:"request",
        loadChildren:()=>import("./modules/request-management/request-management.module").then(m => m.RequestManagementModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
