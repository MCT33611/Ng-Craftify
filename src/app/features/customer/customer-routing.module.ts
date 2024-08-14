import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from '../../components/home/home.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { ProfileModule } from '../profile/profile.module';
import { ChatModule } from '../chat/chat.module';

const routes: Routes = [{
  path:"",
  component:LayoutComponent,
  children:[
    {
      path:"",
      redirectTo:'home',
      pathMatch:'full'
    },
    {
      path:'home',
      component:HomeComponent
    },
    {
      path:'services',
      component:ServiceListComponent
    },
    {
      path:'service/:workerId',
      component:ServiceDetailsComponent
    },
    {
      path:'requests',
      component:RequestListComponent
    },
    
    {
      path:'profile',
      loadChildren: () => ProfileModule
    },
    {
      path:'chat',
      loadChildren: ()=>ChatModule
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
