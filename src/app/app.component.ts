import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';

/**
 * @summary Main app component that acts as the entry point for the Angular application.
 * @example
 * @property {string} title The title of the application.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  /**
   * @property {string} title The title of the application.
   * @default 'ShadowKick'
   */
  title = 'ShadowKick';

  /**
   * @summary Logs out the user only when they close the tab or window.
   */
  @HostListener('window:unload', ['$event'])
  onTabClose(event: Event) {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isRegistered');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }
}
