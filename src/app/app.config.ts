import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FetchApiDataService } from './fetch-api-data.service';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

/**
 * @summary Configures the application with necessary providers, including routing and HTTP client.
 * @example
 * const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideZoneChangeDetection({ eventCoalescing: true }),
 *     provideRouter(routes),
 *     provideHttpClient(),
 *     provideAnimationsAsync(),
 *     FetchApiDataService
 *   ]
 * };
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * @summary Provides zone change detection to the app, enabling automatic change detection when events are triggered.
     * @param {object} options The configuration for zone change detection.
     * @param {boolean} options.eventCoalescing Enables event coalescing to reduce the number of change detection cycles.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * @summary Configures the router for the app with the defined routes.
     * @param {Routes} routes The array of routes defined for the application.
     */
    provideRouter(routes),

    /**
     * @summary Provides the HTTP client for making HTTP requests.
     */
    provideHttpClient(),

    /**
     * @summary Provides asynchronous animation support to the app.
     */
    provideAnimationsAsync(),

    /**
     * @summary Fetches the data from the API and serves it to the app.
     * This service is responsible for handling API calls and data management.
     */
    FetchApiDataService,
  ],
};
