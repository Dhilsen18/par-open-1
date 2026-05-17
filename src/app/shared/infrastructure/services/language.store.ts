/**
 * @summary Signal-based store for application language selection (i18n).
 * @author Estudiante U202319440
 */
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageStore {
  private translate = inject(TranslateService);
  private _currentLang = signal<string>('en');

  readonly currentLang = this._currentLang.asReadonly();

  constructor() {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  setLanguage(lang: 'en' | 'es'): void {
    this._currentLang.set(lang);
    this.translate.use(lang);
  }
}
