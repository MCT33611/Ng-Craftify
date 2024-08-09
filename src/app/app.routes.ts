import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { roleGuard } from './core/guards/role.guard';
import { IRoles } from './core/constants/roles';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';

export const routes: Routes = [


    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: "auth",
        canActivate: [loggedInGuard],
        loadChildren: () => import("../app/features/authentication/authentication.module").then(m => m.AuthenticationModule)
    },
    {
        path: "profile",
        canActivate: [authGuard],
        component: ProfileLayoutComponent,
        children: [{
            path: "",
            loadChildren: () => import("../app/features/profile/profile.module").then(m => m.ProfileModule)
        }]
    },
    {
        path: "admin",
        canActivate: [authGuard, roleGuard],
        data: { role: IRoles.Role_Admin },
        loadChildren: () => import("../app/features/admin/admin.module").then(m => m.AdminModule)
    },
    {
        path: "worker",
        canActivate: [authGuard, roleGuard],
        data: { role: IRoles.Role_Worker },
        loadChildren: () => import("../app/features/worker/worker.module").then(m => m.WorkerModule)
    },
    {
        path: "customer",
        canActivate: [authGuard],
        data: { role: IRoles.Role_Customer },
        loadChildren: () => import("../app/features/customer/customer.module").then(m => m.CustomerModule)
    }


];
