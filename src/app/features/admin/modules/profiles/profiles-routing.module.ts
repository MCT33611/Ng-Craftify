import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AccessComponent } from './components/access/access.component';
import { WorkersListComponent } from './components/workers-list/workers-list.component';
import { approvalComponent } from './components/approval/approval.component';
import { WorkerDetailsComponent } from './components/worker-details/worker-details.component';

const routes: Routes = [
  {
    path:"details/:id",
    component:UserDetailsComponent
  },
  {
    path:"worker-details/:id",
    component:WorkerDetailsComponent
  },
  {
    path:"access/:id",
    component:AccessComponent
  },
  {
    path:"approval/:id",
    component:approvalComponent
  },
  {
    path:"user-list",
    component:UsersListComponent
  },
  {
    path:"worker-list",
    component:WorkersListComponent
  },
  {
    path:"",
    redirectTo:"user-list",
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
