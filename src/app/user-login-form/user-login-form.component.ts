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
  @Output() loginSuccess = new EventEmitter<void>();
  userData = { username: '', password: '' };
  hidePassword = true;

  // Inject dependencies
  fetchApiData = inject(FetchApiDataService);
  snackBar = inject(MatSnackBar);

  // Attempt to login user
  async loginUser(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.fetchApiData.userLogin(this.userData),
      );
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);

      this.snackBar.open('Login successful!', 'OK', {
        duration: 2000,
      });

      this.loginSuccess.emit();
    } catch (error) {
      this.snackBar.open('Login failed: ' + error, 'OK', {
        duration: 2000,
      });
    }
  }
}
