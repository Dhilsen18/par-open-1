/**
 * @summary Page not found view displayed for unsupported navigation routes.
 * @author Estudiante U202319440
 */
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <main class="not-found-container" role="main" aria-label="Page not found">
      <mat-icon class="not-found-icon" aria-hidden="true">search_off</mat-icon>
      <h1>{{ 'NOT_FOUND.TITLE' | translate }}</h1>
      <p class="route-msg">
        {{ 'NOT_FOUND.MESSAGE' | translate : { route: currentRoute } }}
      </p>
      <a
        mat-raised-button
        color="primary"
        routerLink="/home"
        aria-label="Return to Home page">
        {{ 'NOT_FOUND.GO_HOME' | translate }}
      </a>
    </main>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
      gap: 16px;
    }
    .not-found-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      opacity: 0.5;
    }
    h1 { font-size: 32px; font-weight: 500; }
    .route-msg {
      font-size: 16px;
      opacity: 0.75;
      font-family: monospace;
      background: rgba(255,255,255,0.1);
      padding: 8px 16px;
      border-radius: 4px;
    }
  `]
})
export class PageNotFoundComponent {
  private router = inject(Router);
  currentRoute = this.router.url;
}
