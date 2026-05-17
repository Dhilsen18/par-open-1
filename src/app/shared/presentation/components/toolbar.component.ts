/**
 * @summary Standalone toolbar component displaying the YouTube Music logo, navigation links and language switcher.
 * @author Estudiante U202319440
 */
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { LanguageStore } from '../../infrastructure/services/language.store';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    TranslateModule
  ],
  template: `
    <mat-toolbar role="banner" aria-label="YouTube Music Editorial Platform toolbar">
      <div class="toolbar-left">
        <img
          [src]="logoUrl"
          alt="YouTube Music logo"
          class="toolbar-logo"
          aria-label="YouTube Music logo"
          (error)="onLogoError($event)"
        />
        <span class="toolbar-title">{{ 'TOOLBAR.TITLE' | translate }}</span>
      </div>

      <div class="toolbar-center" role="navigation" aria-label="Main navigation">
        <a
          mat-button
          routerLink="/home"
          routerLinkActive="active-link"
          aria-label="Navigate to Home">
          {{ 'TOOLBAR.HOME' | translate }}
        </a>
        <a
          mat-button
          routerLink="/support/editors/new"
          routerLinkActive="active-link"
          aria-label="Navigate to New Editor">
          {{ 'TOOLBAR.NEW_EDITOR' | translate }}
        </a>
      </div>

      <div class="toolbar-right" role="group" aria-label="Language selector">
        <button
          mat-button
          [class.active-lang]="languageStore.currentLang() === 'en'"
          (click)="setLang('en')"
          aria-label="Switch to English"
          [attr.aria-pressed]="languageStore.currentLang() === 'en'">
          {{ 'LANGUAGE.EN' | translate }}
        </button>
        <button
          mat-button
          [class.active-lang]="languageStore.currentLang() === 'es'"
          (click)="setLang('es')"
          aria-label="Switch to Spanish"
          [attr.aria-pressed]="languageStore.currentLang() === 'es'">
          {{ 'LANGUAGE.ES' | translate }}
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      color: #111827;
      border-bottom: 1px solid rgba(17, 24, 39, 0.08);
    }
    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .toolbar-logo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: contain;
      background: white;
      box-shadow: 0 1px 2px rgba(17, 24, 39, 0.12);
    }
    .toolbar-title {
      font-size: 16px;
      font-weight: 500;
      color: #111827;
    }
    .toolbar-center {
      display: flex;
      gap: 4px;
    }
    .toolbar-right {
      display: flex;
      gap: 4px;
    }
    .toolbar-center a,
    .toolbar-right button {
      color: #111827 !important;
    }
    .active-link {
      text-decoration: underline;
      font-weight: bold;
      color: #b91c1c;
    }
    .active-lang {
      font-weight: bold;
      text-decoration: underline;
      color: #b91c1c;
    }
    @media (max-width: 600px) {
      .toolbar-title { display: none; }
      mat-toolbar { flex-wrap: wrap; }
    }
  `]
})
export class ToolbarComponent {
  languageStore = inject(LanguageStore);
  logoUrl = environment.clearbitLogoUrl;

  setLang(lang: 'en' | 'es'): void {
    this.languageStore.setLanguage(lang);
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg';
  }
}
