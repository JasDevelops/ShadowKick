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

/**
 * @summary A component for managing the user's profile, including viewing and updating personal information,
 *              managing favorite movies, and deleting the account.
 *
 * This component allows the user to:
 * - View their profile data, including username, email, birthday, and favorite movies.
 * - Update their profile information such as username, email, password, and birthday.
 * - Remove movies from their favorites.
 * - Open a dialog to view detailed information about a movie.
 * - Delete their account permanently.
 * @example
 * <app-user-profile></app-user-profile>
 */
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
  /**
   * @property {any} user - Stores user data.
   * @default {}
   */
  user: any = {};

  /**
   * @property {any} updatedUser - Stores updated user data for edits.
   * @default {}
   */
  updatedUser: any = {};

  /**
   * @property {any[]} favoriteMovies - List of user's favorite movies.
   * @default []
   */
  favoriteMovies: any[] = [];

  /**
   * @property {boolean} hide - Controls the visibility of the password field.
   * @default true
   */
  hide: boolean = true;

  /**
   * @property {FetchApiDataService} fetchApiData - Service for interacting with the backend API.
   */
  fetchApiData = inject(FetchApiDataService);

  /**
   * @property {Router} router - Router for navigation.
   */
  router = inject(Router);

  /**
   * @property {MatSnackBar} snackBar - MatSnackBar for showing feedback to the user.
   */
  snackBar = inject(MatSnackBar);

  /**
   * @property {MatDialog} dialog - MatDialog for opening the movie details dialog.
   */
  dialog = inject(MatDialog);

  /**
   * @summary Fetches the user's profile from the API.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getUserProfile();
  }

  /**
   * @summary Retrieves the user's profile information.
   * @returns {void}
   */
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

  /**
   * @summary Opens a dialog displaying detailed information about the selected movie.
   * @param {any} movie - The movie object containing movie details.
   * @returns {void}
   */
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

  /**
   * @summary Removes a movie from the user's favorite list.
   * @param {string} movieID - The ID of the movie to be removed from favorites.
   * @returns {void}
   */
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

  /**
   * @summary Updates the user's profile with new information.
   * @returns {void}
   */
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

  /**
   * @summary Deletes the user's account and clears their data from local storage.
   * @returns {void}
   */
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

  /**
   * @summary Formats the given date string into the YYYY-MM-DD format.
   * @param {string | null} dateString - The date string to format.
   * @returns {string | null} The formatted date string or null if input is invalid.
   */
  formatDate(dateString: string | null): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
