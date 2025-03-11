import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CdkListbox } from '@angular/cdk/listbox';
import { MatIconModule } from '@angular/material/icon';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

/**
 * @summary The `DirectorDialogComponent` is responsible for displaying director details and
 * opening a dialog to view the details of a specific movie directed by the selected director.
 * It is a modal dialog that is injected with data for a specific director and can navigate to
 * a movie details dialog when a movie is selected.
 * @example
 * <app-director-dialog></app-director-dialog>
 */
@Component({
  selector: 'app-director-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    CdkListbox,
    MatIconModule,
  ],
  templateUrl: './director-dialog.component.html',
})
export class DirectorDialogComponent {
  /**
   * @property {any} data - The injected data containing the director information.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { director: any }, // Data passed to dialog
    public dialogRef: MatDialogRef<DirectorDialogComponent>, // Reference to current dialog instance
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
    this.dialog.open(MovieDetailsDialogComponent, {
      data: { movie: movie },
      width: '600px',
    });
    this.dialogRef.close();
  }
}
