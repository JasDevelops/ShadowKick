import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // for *ngIf
import { MatButtonModule } from '@angular/material/button';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';

/**
 * @summary This component represents the welcome page of the application. It handles user registration, login, and redirects the user based on their authentication and registration status.
 * @example
 * <app-welcome-page></app-welcome-page>
 */

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    UserLoginFormComponent,
    UserRegistrationFormComponent,
  ],
  templateUrl: './welcome-page.component.html',
})
export class WelcomePageComponent {
  /**
   * @property {boolean} isLoggedIn - Tracks if the user is logged in by checking for a token in localStorage.
   * @default false
   */
  isLoggedIn = false;

  /**
   * @property {boolean} isRegistered - Tracks if the user is registered by checking the `isRegistered` value in localStorage.
   * @default false
   */
  isRegistered = false;

  /**
   * @property {number} selectedTabIndex - Tracks the currently selected tab (0 for Login, 1 for Register).
   * @default 0
   */
  selectedTabIndex = 0;

  constructor(private router: Router) {} // For navigation

  /**
   * @summary Checks the user's authentication and registration status when the component initializes.
   * Redirects the user to the `/movies` route if already logged in, or switches to the registration tab if not registered.
   */
  ngOnInit() {
    this.checkAuthStatus();
    this.checkRegistrationStatus();

    if (this.isLoggedIn) {
      this.router.navigate(['/movies']);
    } else if (!this.isRegistered) {
      this.selectedTabIndex = 1; // Switch to Signup tab if user is not registered
    }
  }

  /**
   * @summary Checks if the user is logged in by verifying the presence of a token in localStorage.
   * @returns {void}
   */
  checkAuthStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  /**
   * @summary Checks if the user is registered by verifying the `isRegistered` value in localStorage.
   * @returns {void}
   */
  checkRegistrationStatus(): void {
    this.isRegistered = localStorage.getItem('isRegistered') === 'true';
  }

  /**
   * @summary Handles successful login. If the user is logged in, they are redirected to the `/movies` route.
   * @returns {void}
   */
  onLoginSuccess(): void {
    this.checkAuthStatus();

    if (this.isLoggedIn) {
      this.router.navigate(['/movies']).then(() => {
        window.location.reload();
      });
    }
  }

  /**
   * @summary Handles successful registration. The user is registered and the tab switches to the login tab.
   * @returns {void}
   */
  onRegistrationSuccess(): void {
    this.isRegistered = true;
    localStorage.setItem('isRegistered', 'true');
    this.selectedTabIndex = 0; // Switch to Login tab after successful signup
  }

  /**
   * @summary Logs out the user by clearing their authentication data from localStorage and updating the component state.
   * @returns {void}
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isRegistered');
    this.isLoggedIn = false;
    this.isRegistered = false;
    this.checkAuthStatus();
  }
}
