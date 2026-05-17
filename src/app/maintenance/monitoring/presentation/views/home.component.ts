/**
 * @summary Home view component displaying welcome message, editor analytics and next service order.
 * @author Estudiante U202319440
 */
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditorAnalyticsComponent } from '../../../../support/editorial-staff/presentation/components/editor-analytics.component';
import { NextServiceOrderComponent } from '../components/next-service-order.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, EditorAnalyticsComponent, NextServiceOrderComponent],
  template: `
    <main class="home-container" role="main" aria-label="Home page">
      <h1>{{ 'HOME.TITLE' | translate }}</h1>
      <p class="welcome-text">{{ 'HOME.WELCOME' | translate }}</p>

      <app-editor-analytics></app-editor-analytics>
      <app-next-service-order></app-next-service-order>
    </main>
  `,
  styles: [`
    .home-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      font-size: 28px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .welcome-text {
      font-size: 16px;
      margin-bottom: 32px;
      opacity: 0.85;
    }
  `]
})
export class HomeComponent {}
