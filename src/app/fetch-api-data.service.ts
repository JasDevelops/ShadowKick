import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://dojo-db-e5c2cf5a1b56.herokuapp.com/';

/**
 * @summary Service for interacting with the backend API, including user authentication, fetching movie data, and managing user favorites.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /**
   * @summary Registers a new user by sending a POST request with the user details.
   * @param {any} userDetails - The user details to be sent in the request body.
   * @returns {Observable<any>} - An observable of the HTTP response.
   */
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

  /**
   * @summary Logs in the user by sending a POST request with their credentials.
   * @param {any} userDetails - The user's login credentials.
   * @returns {Observable<any>} - An observable of the login response.
   */
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

  /**
   * @summary Retrieves the authorization headers with the stored token from localStorage.
   * @returns {HttpHeaders} The authorization headers with Bearer token.
   */
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

  /**
   * @summary Fetches user data by username.
   * @param {string} username - The username of the user to fetch data for.
   * @returns {Observable<any>} Observable with the user data.
   */
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + `users/${username}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @summary Retrieves the username from localStorage.
   * @returns {string | null} The username or null if not found.
   */
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

  /**
   * @summary Fetches all movies from the API.
   * @returns {Observable<any>} Observable with the list of movies.
   */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(`${apiUrl}movies`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * @summary Fetches movie details by title.
   * @param {string} title - The title of the movie to fetch.
   * @returns {Observable<any>} Observable with the movie details.
   */
  public getMovie(title: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${encodeURIComponent(title)}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * @summary Fetches director details by name.
   * @param {string} name - The name of the director to fetch.
   * @returns {Observable<any>} Observable with the director details.
   */
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}directors/${encodeURIComponent(name)}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * @summary Fetches genre details by genre name.
   * @param {string} genreName - The name of the genre to fetch.
   * @returns {Observable<any>} Observable with the genre details.
   */
  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + `genres/${genreName}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @summary Fetches the list of favorite movies for the currently logged-in user.
   * @returns {Observable<any>} Observable with the list of favorite movie IDs.
   */
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

  /**
   * @summary Adds a movie to the logged-in user's favorites.
   * @param {string} movieID - The ID of the movie to add to favorites.
   * @returns {Observable<any>} Observable with the response from the API.
   */
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

  /**
   * @summary Removes a movie from the logged-in user's favorites.
   * @param {string} movieID - The ID of the movie to remove from favorites.
   * @returns {Observable<any>} Observable with the response from the API.
   */
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

  /**
   * @summary Updates the logged-in user's details.
   * @param {any} updatedDetails - The new details to update.
   * @returns {Observable<any>} Observable with the updated user details.
   */
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

  /**
   * @summary Deletes the logged-in user's account.
   * @returns {Observable<any>} Observable with the response from the API.
   */
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

  /**
   * @summary Extracts the response data from the HTTP response.
   * @param {any} res - The HTTP response.
   * @returns {any} - The response data.
   */
  private extractResponseData(res: any): any {
    return res || {};
  }

  /**
   * @summary Handles any errors encountered during HTTP requests.
   * @param {HttpErrorResponse} error - The error response returned by the backend.
   * @returns {Observable<never>} - An observable throwing an error message.
   */
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
