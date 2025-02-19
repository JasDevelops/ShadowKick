import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent {
  userData = { username: '', password: '', email: '', birthday: '' };

  fetchApiData = inject(FetchApiDataService);
  dialogRef = inject(MatDialogRef<UserRegistrationFormComponent>);
  snackBar = inject(MatSnackBar);

  async registerUser(): Promise<void> {
    try {
      const userPayload = { ...this.userData };
      //birthday is only optional
      if (userPayload.birthday === '') {
        (userPayload as any).birthday = undefined;
      }

      await firstValueFrom(this.fetchApiData.userRegistration(userPayload));

      // Store registration status
      localStorage.setItem('isRegistered', 'true');

      this.dialogRef.close('registered');
      this.snackBar.open(
        'You have successfully registered! Log in to continue.',
        'OK',
        { duration: 3000 },
      );
    } catch (error: any) {
      console.error('Registration failed:', error);
      let errorMessage = 'Registration failed. Please try again.';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        } else if (Array.isArray(error.error.errors)) {
          errorMessage = error.error.errors
            .map((err: any) => err.msg)
            .join('\n');
        }
      }

      this.snackBar.open(errorMessage, 'OK', { duration: 4000 });
    }
  }
  // Close button x
  closeDialog(): void {
    this.dialogRef.close();
  }
}
