import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../currency.service';
import { locale as english } from '../../transactionList/i18n/en';
import { locale as arabic } from '../../transactionList/i18n/ar';
import { CoreTranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {
  rate: number = 0;
  message: string = '';
  isSuccess: boolean = false;

  constructor(
    private currencyService: CurrencyService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {}

  submitRate() {
    this.currencyService.postRate(this.rate).subscribe({
      next: (res) => {
        this.message = 'تم الحفظ بنجاح ✅';
        this.isSuccess = true;
        this.hideMessageAfterDelay();
      },
      error: (err) => {
        this.message = 'حصل خطأ، حاول تاني ❌';
        this.isSuccess = false;
        this.hideMessageAfterDelay();
      }
    });
  }

  hideMessageAfterDelay() {
    setTimeout(() => {
      this.message = '';
    }, 10000); // 10 ثواني
  }
}
