import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SecurityComponent } from './components/security/security.component';

const routes: Routes = [
  {
    path:"",
    component:LayoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
