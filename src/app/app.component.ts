import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // for *ngIf
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ShadowKick';
  isLoggedIn = false;
  isRegistered = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.checkRegistrationStatus();
  }

  checkAuthStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  checkRegistrationStatus(): void {
    this.isRegistered = localStorage.getItem('isRegistered') === 'true';
  }
  openUserRegistrationDialog(): void {
    this.dialog
      .open(UserRegistrationFormComponent, {
        width: '280px',
        disableClose: false,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'registered') {
          this.isRegistered = true;
          localStorage.setItem('isRegistered', 'true');
          this.checkRegistrationStatus();
        }
      });
  }

  openUserLoginDialog(): void {
    this.dialog
      .open(UserLoginFormComponent, {
        width: '280px',
        disableClose: false,
      })
      .afterClosed()
      .subscribe(() => {
        this.checkAuthStatus();
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isRegistered');
    this.isLoggedIn = false;
    this.isRegistered = false;
    this.checkAuthStatus();
  }
}
