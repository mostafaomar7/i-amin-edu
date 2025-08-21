import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreTranslationService } from '@core/services/translation.service';

// استيراد ملفات الترجمة
import { locale as english } from '../broker-user/en';
import { locale as arabic } from '../broker-user/ar';

@Component({
  selector: 'app-broker-userinfo',
  templateUrl: './broker-userinfo.component.html',
  styleUrls: ['./broker-userinfo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrokerUserinfoComponent implements OnInit {

  constructor(private _coreTranslationService: CoreTranslationService) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {}
}
