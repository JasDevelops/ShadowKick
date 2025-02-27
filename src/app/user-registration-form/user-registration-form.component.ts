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
  @Output() registrationSuccess = new EventEmitter<void>();
  userData = { username: '', password: '', email: '', birthday: '' };
  hidePassword = true;

  // Inject dependencies
  fetchApiData = inject(FetchApiDataService);
  snackBar = inject(MatSnackBar);

  // Register a new user
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
