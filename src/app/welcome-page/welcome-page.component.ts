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

@Component({
  selector: 'app-welcome-page',
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
  isLoggedIn = false; // Tracks if user is logged in
  isRegistered = false; // Tracks if user is registered
  selectedTabIndex = 0; // Default login tab

  constructor(private router: Router) {} // For navigation

  ngOnInit() {
    // Check if user is logged in
    this.checkAuthStatus();
    // Check if user is registered
    this.checkRegistrationStatus();

    if (this.isLoggedIn) {
      this.router.navigate(['/movies']);
    } else if (!this.isRegistered) {
      this.selectedTabIndex = 1; // Switch to Signup tab if user is not registered
    }
  }
  checkAuthStatus(): void {
    // Update isLoggedIn based on token presence
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  checkRegistrationStatus(): void {
    // Update isRegistered based on local storage
    this.isRegistered = localStorage.getItem('isRegistered') === 'true';
  }
  // Login
  onLoginSuccess(): void {
    this.checkAuthStatus();

    if (this.isLoggedIn) {
      this.router.navigate(['/movies']).then(() => {
        window.location.reload();
      });
    } else {
    }
  }

  // Registration
  onRegistrationSuccess(): void {
    this.isRegistered = true;
    localStorage.setItem('isRegistered', 'true');
    this.selectedTabIndex = 0; // Switch to Login tab after successful signup
  }

  // Log out the user and clear stored data
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isRegistered');
    this.isLoggedIn = false;
    this.isRegistered = false;
    this.checkAuthStatus();
  }
}
