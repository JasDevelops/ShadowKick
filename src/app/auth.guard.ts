import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * @summary Guards route access by ensuring the user is authenticated.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  /**
   * @summary Determines whether a user can access a route. Redirects to the welcome page if the user is not authenticated.
   * @returns {boolean} - True if the user is authenticated, false otherwise.
   */
  canActivate(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      return true;
    } else {
      this.router.navigate(['/welcome']);
      return false;
    }
  }
}
