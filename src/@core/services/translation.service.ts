import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

export interface Locale {
  lang: string;
  data: Object;
}

@Injectable({
  providedIn: 'root'
})
export class CoreTranslationService {
  instant(arg0: string): string {
    throw new Error('Method not implemented.');
  }

  public translator: TranslateService;
  /**
   * Constructor
   *
   * @param {TranslateService} _translateService
   */
  constructor(private _translateService: TranslateService) {
    this.translator = _translateService
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Translate
   *
   * @param {Locale} args
   */
  translate(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach(locale => {
      // use setTranslation() with the third argument value as true to append translations instead of replacing them
      this._translateService.setTranslation(locale.lang, locale.data, true);
    });
  }
}
