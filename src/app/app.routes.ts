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
import { EventsComponent } from './components/events/events.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { MobileComponent } from './components/mobile/mobile.component';
import { EventDetailAdminComponent } from './components/admin/events-admin/eventdetail-admin/eventdetail-admin.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { RemoveRegistrationComponent } from './components/remove-registration/remove-registration.component';
import { CreateEventComponent } from './components/admin/events-admin/create-event/create-event.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { AdminGuardService } from './services/guards/admin-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'userSettings', component: UserProfileComponent,canActivate: [AuthGuardService]},
      { path: 'events',component: EventsComponent},
      { path: 'events/:id', component: EventDetailComponent },
      { path: 'mobile', component: MobileComponent }
    ]
    },
    {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'dashboard-admin', component: DashboardAdminComponent,canActivate: [AdminGuardService],
      children:[
        {path:'users', component:UsersAdminComponent},
        {path:'events', component:EventsAdminComponent},
        {path: 'events/create', component: CreateEventComponent },
        {path: 'events/:id', component: EventDetailAdminComponent },
        {path:'games', component:GamesAdminComponent}
      ]
      },
      {path: 'confirm', component: ConfirmRegistrationComponent},
      {path: 'delete', component: RemoveRegistrationComponent}
    ]
    },
    { path: '**', redirectTo: 'home' }

];
