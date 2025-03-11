import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { firstValueFrom } from 'rxjs';

/**
 * @summary A component that handles user registration functionality.
 * It allows users to register with their username, email, password, and an optional birthday.
 * On successful registration, a success message is displayed, and the user is redirected to the login page.
 * If errors occur during registration, an error message is shown.
 * @example
 * <app-user-registration-form (registrationSuccess)="onRegistrationSuccess()"></app-user-registration-form>
 */

@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-registration-form.component.html',
})
export class UserRegistrationFormComponent {
  /**
   * @property {EventEmitter<void>} registrationSuccess - Emits when user registration is successful.
   */
  @Output() registrationSuccess = new EventEmitter<void>();

  /**
   * @property {Object} userData - Holds the user input data.
   * @property {string} userData.username - The username input.
   * @property {string} userData.password - The password input.
   * @property {string} userData.email - The email input.
   * @property {string} userData.birthday - The optional birthday input.
   */
  userData = { username: '', password: '', email: '', birthday: '' };
  /**
   * @property {boolean} hidePassword - Controls the visibility of the password field.
   * @default true
   */
  hidePassword = true;

  /**
   * @property {FetchApiDataService} fetchApiData - Service for interacting with the backend API.
   */
  fetchApiData = inject(FetchApiDataService);

  /**
   * @property {MatSnackBar} snackBar - MatSnackBar for showing feedback to the user.
   */
  snackBar = inject(MatSnackBar);

  /**
   * @summary Registers a new user with the provided data.
   * @returns {Promise<void>} Resolves if registration is successful. Displays an error message if registration fails.
   * @example
   * await registerUser();
   */
  async registerUser(): Promise<void> {
    try {
      const userPayload = { ...this.userData };
      // Handle optional birthday field
      if (userPayload.birthday === '') {
        (userPayload as any).birthday = undefined;
      }
      await firstValueFrom(this.fetchApiData.userRegistration(userPayload));

      // Mark user as registered in localStorage
      localStorage.setItem('isRegistered', 'true');
      // Close dialog and signal registration success
      this.snackBar.open(
        'You have successfully registered! Log in to continue.',
        'OK',
        { duration: 2000 },
      );
      this.registrationSuccess.emit();
    } catch (error: any) {
      console.error('Registration failed:', error);
      let errorMessage = 'Registration failed. Please try again.';

      if (error.error?.errors) {
        errorMessage = error.error.errors
          .map((e: { msg: string }) => e.msg)
          .join('\n');
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.snackBar.open(errorMessage, 'OK', { duration: 4000 });
    }
  }
}
