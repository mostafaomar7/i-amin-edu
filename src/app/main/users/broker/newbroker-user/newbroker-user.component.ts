import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreTranslationService } from '@core/services/translation.service';

// استيراد ملفات الترجمة
import { locale as english } from './en';
import { locale as arabic } from './ar';

@Component({
  selector: 'app-newbroker-user',
  templateUrl: './newbroker-user.component.html',
  styleUrls: ['./newbroker-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewbrokerUserComponent implements OnInit {

  constructor(private _coreTranslationService: CoreTranslationService) {
    // تحميل التراجم الخاصة بالكمبونينت
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {}
}
