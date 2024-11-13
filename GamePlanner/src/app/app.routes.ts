import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './components/layout/auth-layout/auth-layout.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { UsersAdminComponent } from './components/admin/users-admin/users-admin.component';
import { EventsAdminComponent } from './components/admin/events-admin/events-admin.component';
import { GamesAdminComponent } from './components/admin/games-admin/games-admin.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: HomeComponent },
          { path: 'userSettings', component: UserProfileComponent},
          
          
        ]
      },
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
          { path: 'dashboard-admin', component: DashboardAdminComponent,
            children:[
              {path:'users', component:UsersAdminComponent},
              {path:'events', component:EventsAdminComponent},
              {path:'games', component:GamesAdminComponent}
            ]
          }
        ]
      },
      { path: '**', redirectTo: 'home' }

];
