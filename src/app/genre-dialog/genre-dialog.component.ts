import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkListbox } from '@angular/cdk/listbox';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

/**
 * @summary The `GenreDialogComponent` is responsible for displaying genre details and
 * opening a dialog to view the details of a specific movie within that genre.
 * It is a modal dialog that is injected with data for a specific genre and can navigate to
 * a movie details dialog when a movie is selected.
 * @example
 * <app-genre-dialog></app-genre-dialog>
 */
@Component({
  selector: 'app-genre-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    CdkListbox,
  ],
  templateUrl: './genre-dialog.component.html',
})
export class GenreDialogComponent {
  /**
   * @property {any} data - The injected data containing the genre information.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { genre: any }, // Data passed to dialog
    public dialogRef: MatDialogRef<GenreDialogComponent>, // Reference to current dialog instance
    private dialog: MatDialog, // Service to open dialog windows
  ) {}

  /**
   * @summary Opens a dialog displaying detailed information about the selected movie.
   * @param {any} movie - The movie object to show in the movie details dialog.
   * @returns {void}
   * @example
   * openMovie(movie);
   */
  openMovie(movie: any): void {
    console.log('Opening movie:', movie);
    this.dialog.open(MovieDetailsDialogComponent, {
      data: { movie: movie },
      width: '600px',
    });
    this.dialogRef.close();
  }
}
