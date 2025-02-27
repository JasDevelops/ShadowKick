import { Component, OnInit, inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // for *ngIf
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkListbox } from '@angular/cdk/listbox';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    CommonModule,
    MatTabsModule,
    CdkListbox,
    RouterModule,
  ],
})
export class UserProfileComponent implements OnInit {
  user: any = {}; // Stores user data
  updatedUser: any = {}; // Stores updated user data for edits
  favoriteMovies: any[] = []; // List of user's favorite movies
  hide: boolean = true; // For password visibility

  // Dependency injection
  fetchApiData = inject(FetchApiDataService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  ngOnInit(): void {
    // Load user profile on init
    this.getUserProfile();
  }
  // Fetch user data from API
  getUserProfile(): void {
    const username = localStorage.getItem('user') || '';
    if (!username) {
      console.error('No username found in localStorage.');
      return;
    }

    this.fetchApiData.getUser(username).subscribe({
      next: (resp: any) => {
        if (resp.user) {
          this.user = resp.user;
          this.updatedUser = {
            username: this.user.username || '',
            email: this.user.email || '',
            password: '',
            birthday: this.user.birthday
              ? this.formatDate(this.user.birthday)
              : '',
          };
          this.favoriteMovies = this.user.favourites || [];
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          console.error('User data is missing from the API response.');
        }
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
        this.snackBar.open('Error fetching profile. Please try again.', 'OK', {
          duration: 4000,
        });
      },
    });
  }
  // Open movie dialog
  openMovie(movie: any): void {
    if (!movie || !movie.title) {
      console.error('Invalid movie data:', movie);
      return;
    }

    this.fetchApiData.getMovie(movie.title).subscribe({
      next: (fullMovie) => {
        this.dialog.open(MovieDetailsDialogComponent, {
          data: { movie: fullMovie },
          width: '600px',
        });
      },
      error: (err) => console.error('Error fetching full movie details:', err),
    });
  }

  // Remove from favourites
  removeFromFavorites(movieID: string): void {
    const username = this.fetchApiData.getUsername();
    if (!username) {
      console.error('No username found in localStorage.');
      return;
    }

    this.fetchApiData.removeFavoriteMovie(movieID).subscribe({
      next: (response) => {
        this.favoriteMovies = this.favoriteMovies.filter(
          (movie) => movie.movieId !== movieID,
        );

        const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
        updatedUser.favourites = this.favoriteMovies;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (err) =>
        console.error('Error removing movie from favorites:', err),
    });
  }

  // Update user profile
  updateUserProfile(): void {
    const username = this.fetchApiData.getUsername();
    if (!username) {
      console.error('No username found in localStorage.');
      return;
    }

    const updatedData: any = {};
    if (
      this.updatedUser.username &&
      this.updatedUser.username !== this.user.username
    ) {
      updatedData.newUsername = this.updatedUser.username;
    }
    if (this.updatedUser.email && this.updatedUser.email !== this.user.email) {
      updatedData.newEmail = this.updatedUser.email;
    }
    if (this.updatedUser.password && this.updatedUser.password.trim()) {
      updatedData.newPassword = this.updatedUser.password.trim();
    }
    if (
      this.updatedUser.birthday &&
      this.updatedUser.birthday !== this.user.birthday
    ) {
      updatedData.newBirthday = this.updatedUser.birthday;
    }
    console.log('Updating with:', updatedData);

    if (Object.keys(updatedData).length === 0) {
      this.snackBar.open('No changes detected.', 'OK', { duration: 3000 });
      return;
    }
    // Send update request to API
    this.fetchApiData.updateUser(updatedData).subscribe({
      next: (resp: any) => {
        this.snackBar.open('Profile updated successfully!', 'OK', {
          duration: 3000,
        });
        localStorage.setItem('user', JSON.stringify(resp.user));

        if (resp.user.username && resp.user.username !== username) {
          localStorage.setItem('username', resp.user.username);
        }

        this.getUserProfile();
      },
      error: (error) => {
        console.error('Update failed:', error);

        let errorMessage = 'Update failed. Please check your input.';

        if (error.error && typeof error.error === 'object') {
          if (error.error.errors && Array.isArray(error.error.errors)) {
            errorMessage = error.error.errors
              .map((e: { param?: string; msg: string }) =>
                e.param ? `• ${e.param}: ${e.msg}` : `• ${e.msg}`,
              )
              .join('\n');
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.snackBar.open(errorMessage, 'OK', { duration: 4000 });
      },
    });
  }

  // Delete Profile
  deleteAccount(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      this.fetchApiData.deleteUser().subscribe({
        next: () => {
          this.snackBar.open('Account deleted successfully.', 'OK', {
            duration: 3000,
          });
          localStorage.clear();
          this.router.navigate(['welcome']);
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          this.snackBar.open(
            'Error deleting account. Please try again.',
            'OK',
            { duration: 4000 },
          );
        },
      });
    }
  }

  // Format birthday date (YYYY-MM-DD)
  formatDate(dateString: string | null): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
