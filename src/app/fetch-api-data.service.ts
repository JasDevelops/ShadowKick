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
      .post(apiUrl + 'users', userDetails, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError),
      );
  }

  // ** User login (store Token and Username) **
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post<{
        token: string;
        user: { username: string };
      }>(`${apiUrl}login`, userDetails)
      .pipe(
        map((response) => {
          if (response.token && response.user.username) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.user.username);
          } else {
            console.error('Invalid login response:', response);
          }
          return response;
        }),
        catchError(this.handleError),
      );
  }

  //Get authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: No token found in localStorage');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // **Get user data**
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + `users/${username}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  public getUsername(): string | null {
    const userData = localStorage.getItem('user');
    try {
      const parsedUser = JSON.parse(userData || '{}');
      return parsedUser.username || null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }
  // **Get all movies**
  public getAllMovies(): Observable<any> {
    return this.http
      .get(`${apiUrl}movies`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // **Get Movie details**
  public getMovie(title: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${encodeURIComponent(title)}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // **Get Director details**
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}directors/${encodeURIComponent(name)}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // **Get genre**
  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + `genres/${genreName}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // **Get Favorites for a user**
  public getUserFavorites(): Observable<any> {
    const username = this.getUsername();
    if (!username) {
      console.error('Error: No username found in localStorage');
      return throwError(() => new Error('User is not logged in.'));
    }

    return this.http
      .get<{ user: { favourites: any[] } }>(
        `${apiUrl}users/${encodeURIComponent(username)}`,
        {
          headers: this.getAuthHeaders(),
        },
      )
      .pipe(
        map((response) => {
          if (!response.user || !Array.isArray(response.user.favourites)) {
            console.error('Favorites response is not an array:', response);
            return [];
          }
          const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
          updatedUser.favourites = response.user.favourites;
          localStorage.setItem('user', JSON.stringify(updatedUser));

          return response.user.favourites.map((fav) => fav.movieId);
        }),
        catchError(this.handleError),
      );
  }

  // **Add to Favorites**
  public addFavoriteMovie(movieID: string): Observable<any> {
    const username = this.getUsername();
    if (!username) {
      return throwError(() => new Error('User is not logged in.'));
    }

    return this.http
      .put(
        `${apiUrl}users/${encodeURIComponent(username)}/favourites/${movieID}`,
        {},
        { headers: this.getAuthHeaders() },
      )
      .pipe(catchError(this.handleError));
  }

  // **Delete Movie from Favorites**
  public removeFavoriteMovie(movieID: string): Observable<any> {
    const username = this.getUsername();
    if (!username) {
      return throwError(() => new Error('User is not logged in.'));
    }

    return this.http
      .delete(
        `${apiUrl}users/${encodeURIComponent(username)}/favourites/${movieID}`,
        { headers: this.getAuthHeaders() },
      )
      .pipe(catchError(this.handleError));
  }

  // **Edit/update User**
  public updateUser(updatedDetails: any): Observable<any> {
    const username = this.getUsername();
    if (!username) {
      return throwError(() => new Error('User is not logged in.'));
    }

    return this.http
      .put<{ user: any }>(
        `${apiUrl}users/${encodeURIComponent(username)}`,
        updatedDetails,
        {
          headers: this.getAuthHeaders(),
        },
      )
      .pipe(
        map((response) => {
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));

            if (response.user.username && response.user.username !== username) {
              localStorage.setItem('username', response.user.username);
            }
          }
          return response;
        }),
        catchError(this.handleError),
      );
  }

  // **Delete User**
  public deleteUser(): Observable<any> {
    const userData = localStorage.getItem('user');
    let username: string;

    try {
      const parsedUser = JSON.parse(userData || '');
      username = parsedUser.username || parsedUser;
    } catch (error) {
      username = userData || ''; // Fallback
    }

    if (!username || typeof username !== 'string') {
      return throwError(
        () => new Error('Invalid username found in local storage'),
      );
    }

    return this.http
      .delete(`${apiUrl}users/${encodeURIComponent(username)}`, {
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
    console.error('Raw error response:', error.error);

    let errorMessage = 'Something went wrong; please try again later.';

    if (error.error) {
      try {
        let errorBody;
        if (typeof error.error === 'string') {
          console.error('Error is a string:', error.error);
          errorBody = JSON.parse(error.error);
        } else {
          errorBody = error.error;
        }

        console.error('Parsed error body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }

        if (errorBody.errors) {
          console.error('Validation errors object:', errorBody.errors);

          if (
            typeof errorBody.errors === 'object' &&
            !Array.isArray(errorBody.errors)
          ) {
            errorMessage = Object.keys(errorBody.errors)
              .map((field) => `${field}: ${errorBody.errors[field]}`)
              .join('\n');
          } else if (Array.isArray(errorBody.errors)) {
            errorMessage = errorBody.errors
              .map((err: any) => err.msg || JSON.stringify(err))
              .join('\n');
          }
        }

        if (!errorMessage) {
          errorMessage = 'An unexpected error occurred.';
        }
      } catch (parseError) {
        console.error('Error parsing backend response:', parseError);
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
