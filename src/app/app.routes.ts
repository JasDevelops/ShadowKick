import { Routes } from '@angular/router';

import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  {
    path: 'movies',
    component: MovieCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
];
