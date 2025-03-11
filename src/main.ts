/**
 * @summary Bootstraps the Angular application.
 * Initializes the app by setting up the root component (`AppComponent`)
 * and applying configuration settings from `appConfig`.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
