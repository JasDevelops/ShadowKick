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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { genre: any }, // Data passed to dialog
    public dialogRef: MatDialogRef<GenreDialogComponent>, // Reference to current dialog instance
    private dialog: MatDialog, // Service to open dialog windows
  ) {}

  // Open movie details dialog
  openMovie(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      data: { movie },
      width: '600px',
    });
    this.dialogRef.close();
  }
}
