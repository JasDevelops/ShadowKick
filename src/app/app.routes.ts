import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { AuthGuard } from './auth.guard';

/**
 * @summary Defines the routes for the application, including protected routes for movie listings and user profiles.
 * @example
 * const routes: Routes = [
 *   { path: 'welcome', component: WelcomePageComponent },
 *   { path: 'movies', component: MovieCardComponent, canActivate: [AuthGuard] },
 *   { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] }
 * ];
 */
export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomePageComponent,
    /**
     * @summary The route for the homepage/welcome page.
     */
  },
  {
    path: 'movies',
    component: MovieCardComponent,
    canActivate: [AuthGuard],
    /**
     * @summary The route for browsing movies.
     * This route is protected and requires the user to be authenticated.
     */
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    /**
     * @summary The route for viewing the user's profile.
     * This route is protected and requires the user to be authenticated.
     */
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
    /**
     * @summary The default route, which redirects to the `welcome` path.
     */
  },
  {
    path: '**',
    redirectTo: 'welcome',
    pathMatch: 'full',
    /**
     * @summary Wildcard route that redirects to `welcome` if no other route is matched.
     */
  },
];
