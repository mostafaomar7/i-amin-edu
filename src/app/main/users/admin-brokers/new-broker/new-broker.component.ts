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
      id: [''], // ✅ حقل id
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // في التعديل ممكن تخليه optional
      image: [''],
      isActive: [true, Validators.required],
      info: ['']
    });

    // ✅ لو فيه id في الـ route يبقى تعديل
    const brokerId = this.route.snapshot.paramMap.get('id');
    if (brokerId) {
      this.loadBroker(+brokerId);
    }
  }

  async loadBroker(id: number) {
  this.isLoading = true;
  await this.brokerService.getBrokerById(id).then(response => {
    this.isLoading = false;
    if (response.status) {
      const broker = response.innerData;

      // نجهز object بنفس شكل الفورم
      const formData = {
        id: broker.userId,                 // عشان الـ update يشتغل على userId
        firstName: broker.user.firstName,
        lastName: broker.user.lastName,
        phone: broker.user.phone,
        email: broker.user.email,
        password: '',                      // سيبه فاضي في حالة التعديل
        image: broker.user.image || broker.image,
        isActive: broker.isActive,
        info: broker.info
      };

      this.brokerForm.patchValue(formData);
      this.selectedFile = broker.user.image || broker.image; // لو عايز تعرض صورة حالية
    } else {
      Swal.fire('FAILED', response.message, 'error');
    }
  });
}


  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile);
    this.brokerForm.get("image").setValue(imageFile.name);
  }

  deleteImage() {
    this.brokerForm.get("image").setValue(null);
    this.selectedFile = null;
  }

  async onSubmit() {
    if (this.brokerForm.valid) {
      this.isLoading = true;

      if (this.brokerForm.get('id').value) {
        // ✅ Update broker
        await this.brokerService.updateBroker(this.brokerForm.value).then(response => {
          this.isLoading = false;
          if (response.status) {
            Swal.fire('SUCCESS', 'BROKER_UPDATED_SUCCESSFULLY', 'success');
            this.router.navigate(['/users/broker-list']); 
          } else {
            Swal.fire('FAILED', response.message, 'error');
          }
        });
      } else {
        // ✅ Create broker
        await this.brokerService.createBroker(this.brokerForm.value).then(response => {
          this.isLoading = false;
          if (response.status) {
            Swal.fire('SUCCESS', 'BROKER_CREATED_SUCCESSFULLY', 'success');
            this.router.navigate(['/users/brokers/list']); 
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
