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
 * @summary A component that provides a login form for the user to authenticate using their username and password.
 * This component is used to handle user login functionality, including submitting login credentials to the backend
 * and showing feedback through a snack bar.
 * @example
 * <app-user-login-form></app-user-login-form>
 */
@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-login-form.component.html',
})
export class UserLoginFormComponent {
  /**
   * @property {EventEmitter<void>} loginSuccess - Emits when the login process is successful.
   */
  @Output() loginSuccess = new EventEmitter<void>();

  /**
   * @property {Object} userData - Holds the user input data.
   * @property {string} userData.username - The username input.
   * @property {string} userData.password - The password input.
   * @default { username: '', password: '' }
   */
  userData = { username: '', password: '' };

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
   * @summary Attempts to log in the user by sending the credentials to the API.
   * If successful, stores the token and user details in localStorage,
   * then emits the login success event and shows a success message.
   * If an error occurs, it shows an error message.
   * @returns {Promise<void>}
   * @example
   * await loginUser();
   */
  async loginUser(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.fetchApiData.userLogin(this.userData),
      );
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);

      // Show success message
      this.snackBar.open('Login successful!', 'OK', {
        duration: 2000,
      });
      // Emit the login success event
      this.loginSuccess.emit();
    } catch (error) {
      // Show error message on failure
      this.snackBar.open('Login failed: ' + error, 'OK', {
        duration: 2000,
      });
    }
  }
}
