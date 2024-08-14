import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ImageManagementComponent } from './components/image-management/image-management.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { ReviewRatingComponent } from '../../shared/components/review-rating/review-rating.component';
import { ChatModule } from '../chat/chat.module';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "images",
        component: ImageManagementComponent
      },
      {
        path: "requests",
        component: RequestListComponent
      },
      {
        path: "reviews/:Id",
        component: ReviewRatingComponent
      },
      {
        path:'chat',
        loadChildren: ()=>ChatModule
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerRoutingModule { }
