import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { roleGuard } from './core/guards/role.guard';
import { IRoles } from './core/constants/roles';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { ProfileModule } from './features/profile/profile.module';
import { AdminModule } from './features/admin/admin.module';
import { WorkerModule } from './features/worker/worker.module';
import { CustomerModule } from './features/customer/customer.module';

export const routes: Routes = [


    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: "auth",
        canActivate: [loggedInGuard],
        loadChildren:()=> AuthenticationModule
    },
    {
        path: "profile",
        canActivate: [authGuard],
        component: ProfileLayoutComponent,
        children: [{
            path: "",
            loadChildren: () => ProfileModule
        }]
    },
    {
        path: "admin",
        canActivate: [authGuard, roleGuard],
        data: { role: IRoles.Role_Admin },
        loadChildren: () => AdminModule
    },
    {
        path: "worker",
        canActivate: [authGuard, roleGuard],
        data: { role: IRoles.Role_Worker },
        loadChildren: () => WorkerModule
    },
    {
        path: "customer",
        canActivate: [authGuard],
        data: { role: IRoles.Role_Customer },
        loadChildren: () => CustomerModule
    }


];
