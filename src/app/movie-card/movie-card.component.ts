import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import {
  MatPaginatorModule,
  PageEvent,
  MatPaginator,
} from '@angular/material/paginator';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

/**
 * @summary The MovieCardComponent is responsible for displaying a list of movies,
 * allowing users to interact with each movie's details, toggle favorites, and paginate through the list.
 * @example
 * <app-movie-card></app-movie-card>
 */
@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
  ],
})
export class MovieCardComponent implements OnInit {
  /**
   * @property {any[]} movies - List of all movies fetched from the API.
   * @default []
   */
  movies: any[] = [];

  /**
   * @property {any[]} displayedMovies - List of movies currently being displayed based on pagination.
   * @default []
   */
  displayedMovies: any[] = [];

  /**
   * @property {string[]} favoriteMovies - List of movie IDs that are marked as favorites by the user.
   * @default []
   */
  favoriteMovies: string[] = [];

  /**
   * @property {boolean} hidePageSize - Controls whether the page size selection is hidden.
   * @default true
   */
  hidePageSize = true;

  /**
   * @property {number} pageSize - The number of items to display per page.
   * @default 6
   */
  pageSize = 6;

  /**
   * @property {number} pageIndex - The current page index for pagination.
   * @default 0
   */
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {}

  /**
   * @summary Initializes the component and fetches movies and favorites on load.
   * @returns {void}
   */
  ngOnInit(): void {
    this.fetchMovies();
    this.fetchFavorites();
  }

  /**
   * @summary Fetches all movies from the API and updates the displayed movies for pagination.
   * @returns {void}
   */
  fetchMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.updateDisplayedMovies();
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error fetching movies:', err),
    });
  }

  /**
   * @summary Fetches the user's favorite movies from the API and updates the local storage.
   * @returns {void}
   */
  fetchFavorites(): void {
    this.fetchApiData.getUserFavorites().subscribe({
      next: (favorites) => {
        this.favoriteMovies = favorites;
        const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
        updatedUser.favourites = favorites;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (err) => console.error('Error fetching favorites:', err),
    });
  }

  /**
   * @summary Checks if a movie is in the user's favorites.
   * @param {string} movieID - The ID of the movie.
   * @returns {boolean} True if the movie is a favorite, false otherwise.
   */
  isFavorite(movieID: string): boolean {
    return this.favoriteMovies.includes(movieID);
  }

  /**
   * @summary Toggles the favorite status of a movie, adding or removing it from the favorites list.
   * @param {string} movieID - The ID of the movie to toggle.
   * @returns {void}
   */
  toggleFavorite(movieID: string): void {
    if (this.isFavorite(movieID)) {
      // Remove from favorites
      this.fetchApiData.removeFavoriteMovie(movieID).subscribe({
        next: () => {
          this.favoriteMovies = this.favoriteMovies.filter(
            (id) => id !== movieID,
          );
          this.updateLocalFavorites();
        },
        error: (err) => console.error('Error removing favorite:', err),
      });
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(movieID).subscribe({
        next: () => {
          this.favoriteMovies.push(movieID);
          this.updateLocalFavorites();
        },
        error: (err) => console.error('Error adding favorite:', err),
      });
    }
  }

  /**
   * @summary Updates the user's favorite movies in local storage and triggers change detection.
   * @returns {void}
   */
  updateLocalFavorites(): void {
    const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
    updatedUser.favourites = this.favoriteMovies;
    localStorage.setItem('user', JSON.stringify(updatedUser));

    this.cdRef.detectChanges();
  }

  /**
   * @summary Opens a dialog to show detailed information about the movie's genre.
   * @param {any} genre - The genre object of the movie.
   * @returns {void}
   */
  openGenreDialog(genre: any): void {
    this.fetchApiData.getGenre(genre.name).subscribe((genreData) => {
      this.dialog.open(GenreDialogComponent, {
        data: { genre: genreData },
        width: '600px',
      });
    });
  }

  /**
   * @summary Opens a dialog to show detailed information about the movie's director.
   * @param {string} directorName - The name of the movie's director.
   * @returns {void}
   */
  openDirectorDialog(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe((director) => {
      this.dialog.open(DirectorDialogComponent, {
        data: { director },
        width: '600px',
      });
    });
  }

  /**
   * @summary Opens a dialog to show detailed information about the movie.
   * @param {any} movie - The movie object to view details.
   * @returns {void}
   */
  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      data: { movie },
      width: '600px',
    });
  }

  /**
   * @summary Updates the list of movies displayed based on the current page index and page size.
   * @returns {void}
   */
  updateDisplayedMovies(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedMovies = this.movies.slice(startIndex, endIndex);
  }

  /**
   * @summary Handles pagination changes and updates the displayed movies.
   * @param {PageEvent} event - The event triggered by the paginator.
   * @returns {void}
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedMovies();
  }
}
