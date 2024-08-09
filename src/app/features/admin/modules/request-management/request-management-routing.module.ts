import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestRejectComponent } from './components/request-reject/request-reject.component';

const routes: Routes = [
  {
    path:"",
    pathMatch:'full',
    redirectTo:"list"
  },
  {
    path:"list",
    component:RequestListComponent
  },
  {
    path:"reject/:id",
    component:RequestRejectComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestManagementRoutingModule { }
