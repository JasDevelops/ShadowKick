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
    console.log('Attempting to register with:', userDetails);

    return this.http
      .post(apiUrl + 'users', userDetails, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response) => {
          console.log('Registration successful:', response);
          return response;
        }),
        catchError(this.handleError),
      );
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
    console.error('Backend returned status:', error.status);
    console.error('Full error response:', error);

    let errorMessage = 'Something went wrong; please try again later.';

    if (error.error) {
      try {
        let errorBody;
        if (typeof error.error === 'string') {
          errorBody = JSON.parse(error.error);
        } else {
          errorBody = error.error;
        }

        console.error('Parsed error body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else if (errorBody.errors && Array.isArray(errorBody.errors)) {
          errorMessage = errorBody.errors.map((err: any) => err.msg).join('\n');
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
      } catch (parseError) {
        console.error('Error parsing backend response:', parseError);
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
