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
  selector: 'app-user-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent {
  userData = { username: '', password: '' };

  fetchApiData = inject(FetchApiDataService);
  dialogRef = inject(MatDialogRef<UserLoginFormComponent>);
  snackBar = inject(MatSnackBar);

  async loginUser(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.fetchApiData.userLogin(this.userData),
      );
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);

      this.dialogRef.close();
      this.snackBar.open('Login successful!', 'OK', {
        duration: 2000,
      });
    } catch (error) {
      this.snackBar.open('Login failed: ' + error, 'OK', {
        duration: 2000,
      });
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
