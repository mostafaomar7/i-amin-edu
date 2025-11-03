import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BrokerService } from '../broker.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';

@Component({
  selector: 'app-new-broker',
  templateUrl: './new-broker.component.html',
  styleUrls: ['./new-broker.component.scss']
})
export class NewBrokerComponent implements OnInit {
  brokerForm: FormGroup;
  isLoading = false;
  selectedFile: any;

  private baseUrl = 'https://www.iamin-edu.com/develop/api/v1/iam-in-backend-value/uploads'; // ✅ مسار الصور الأساسي

  constructor(
    private fb: FormBuilder,
    private brokerService: BrokerService,
    private _coreTranslationService: CoreTranslationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // تحميل ملفات الترجمة
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.brokerForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      image: [''],
      isActive: [true, Validators.required],
      info: ['']
    });

    const brokerId = this.route.snapshot.paramMap.get('id');
    if (brokerId) {
      this.loadBroker(+brokerId);
    }
  }

  /** ✅ دالة لتكوين رابط الصورة الكامل */
  private getFullImageUrl(imagePath: string): string | null {
    if (!imagePath) return null;
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.baseUrl}/${imagePath}`;
  }

  /** ✅ تحميل بيانات البروكر */
  async loadBroker(id: number) {
  this.isLoading = true;
  await this.brokerService.getBrokerById(id).then(response => {
    this.isLoading = false;
    console.log('🟦 getBrokerById response:', response);

    if (response.status) {
      const broker = response.innerData || response.data;
      const user = broker.user || broker.broker?.user || broker; // fallback

      // 🧠 تأكد من استخراج الـ id الصحيح
      const userId = user.id || broker.userId || broker.broker?.userId || id;

      const imagePath = user.image || broker.broker?.image;
      const fullImageUrl = this.getFullImageUrl(imagePath);

      const formData = {
        id: userId, // ✅ هنا المهم
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        password: '',
        image: fullImageUrl,
        isActive: broker.accountStatus === 2,
        info: broker.broker?.info || ''
      };

      console.log('🟩 Patched Form Data:', formData);

      this.brokerForm.patchValue(formData);
      this.selectedFile = fullImageUrl;
    } else {
      Swal.fire('FAILED', response.message, 'error');
    }
  });
}


  /** ✅ اختيار صورة جديدة */
  onFileSelected(event: any): void {
  const imageFile = event.target.files[0];
  const fileReader = new FileReader();

  fileReader.onload = () => {
    this.selectedFile = fileReader.result;
  };
  fileReader.readAsDataURL(imageFile);

  // ✅ ارفع الصورة فعليًا للسيرفر
  this.brokerService.uploadImage(imageFile).then((response: any) => {
    if (response.status) {
      this.brokerForm.get('image')?.setValue(response.innerData.url);
    } else {
      console.error('Image upload failed:', response.message);
    }
  });
}


  /** ✅ حذف الصورة */
  deleteImage() {
    this.brokerForm.get('image')?.setValue(null);
    this.selectedFile = null;
  }

  /** ✅ حفظ البيانات */
  async onSubmit() {
    if (this.brokerForm.valid) {
      this.isLoading = true;

      const formValue = { ...this.brokerForm.value };
      formValue.accountStatus = formValue.isActive ? 2 : 1;
      delete formValue.isActive;

      if (this.brokerForm.get('id')?.value) {
        // Update broker
        await this.brokerService.updateBroker(formValue).then(response => {
          this.isLoading = false;
          console.log('🟩 updateBroker response:', response);
          if (response.status) {
            Swal.fire('SUCCESS', 'BROKER_UPDATED_SUCCESSFULLY', 'success');
            this.router.navigate(['/users/broker-list']);
          } else {
            Swal.fire('FAILED', response.message, 'error');
          }
        });
      } else {
        // Create broker
        await this.brokerService.createBroker(formValue).then(response => {
          this.isLoading = false;
          console.log('🟩 createBroker response:', response);
          if (response.status) {
            Swal.fire('SUCCESS', 'BROKER_CREATED_SUCCESSFULLY', 'success');
            this.router.navigate(['/users/broker-list']);
          } else {
            Swal.fire('FAILED', response.message, 'error');
          }
        });
      }
    } else {
      this.brokerForm.markAllAsTouched();
    }
  }
}
