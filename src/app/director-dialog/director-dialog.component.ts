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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { director: any }, // Data passed to dialog
    public dialogRef: MatDialogRef<DirectorDialogComponent>, // Reference to current dialog instance
    private dialog: MatDialog, // Service to open dialog windows
  ) {}

  // Open movie details dialog
  openMovie(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      data: { movie: movie },
      width: '600px',
    });
    this.dialogRef.close();
  }
}
