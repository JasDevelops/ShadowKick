import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://dojo-db-e5c2cf5a1b56.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // **User registration**
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // **User login (store Token)**
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Store token after login
        }
        return response;
      }),
      catchError(this.handleError),
    );
  }

  // Helper: Get authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // **Get all movies**
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // **Get one movie**
  public getMovie(movieId: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movieId}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // **Get director**
  public getDirector(directorName: string): Observable<any> {
    return this.http
      .get(apiUrl + `directors/${directorName}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // **Get genre**
  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + `genres/${genreName}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // **Get user data**
  public getUser(): Observable<any> {
    return this.http
      .get(apiUrl + 'users', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // **Get Favorites for a user**
  public getFavoriteMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'users/favorites', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // **Add to Favorites**
  public addFavoriteMovie(movieId: string): Observable<any> {
    return this.http
      .post(
        apiUrl + `users/favorites/${movieId}`,
        {},
        { headers: this.getAuthHeaders() },
      )
      .pipe(catchError(this.handleError));
  }

  // **Edit User**
  public editUser(updatedDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users', updatedDetails, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // **Delete User**
  public deleteUser(): Observable<any> {
    return this.http
      .delete(apiUrl + 'users', { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // **Delete Movie from Favorites**
  public removeFavoriteMovie(movieId: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/favorites/${movieId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // **Extract Response Data**
  private extractResponseData(res: any): any {
    return res || {};
  }

  // **Error Handling**
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    return throwError(
      () => new Error('Something went wrong; please try again later.'),
    );
  }
}
