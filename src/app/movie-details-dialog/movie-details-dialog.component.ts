import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CdkListbox } from '@angular/cdk/listbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    CdkListbox,
    MatIconModule,
  ],
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.scss'],
})
export class MovieDetailsDialogComponent implements OnInit {
  movie: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Data passed to dialog
    private fetchApiData: FetchApiDataService, // Service to fetch data from API
    private dialog: MatDialog, // Service to open dialog windows
    private dialogRef: MatDialogRef<MovieDetailsDialogComponent>, // Reference to current dialog instance
  ) {}

  ngOnInit(): void {
    // Initialize component and assign movie data
    if (typeof this.data.movie.genre === 'string') {
      this.data.movie.genre = { name: this.data.movie.genre, description: '' };
      this.movie = this.data.movie;
    }
  }

  // Open genre dialog
  openGenreDialog(genre: any): void {
    this.fetchApiData.getGenre(genre.name).subscribe((genreData) => {
      console.log('Genre data fetched:', genreData);
      this.dialog.open(GenreDialogComponent, {
        data: { genre: genreData },
        width: '600px',
      });
      this.dialogRef.close();
    });
  }
  // Open director dialog
  openDirectorDialog(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe((director) => {
      this.dialog.open(DirectorDialogComponent, {
        data: { director },
        width: '600px',
      });
      this.dialogRef.close();
    });
  }
}
