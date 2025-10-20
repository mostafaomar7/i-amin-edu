import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from './en';
import { locale as arabic } from './ar';
import Swal from 'sweetalert2'; // 🟢 استيراد SweetAlert2

@Component({
  selector: 'app-newbroker-user',
  templateUrl: './newbroker-user.component.html',
  styleUrls: ['./newbroker-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewbrokerUserComponent implements OnInit {
  userForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', Validators.required],
      userType: [3, [Validators.required]], // 2 أو 3 فقط
      bioAr: ['', [Validators.required, Validators.minLength(3)]],
      bioEn: ['', [Validators.required, Validators.minLength(3)]],
      image: [null]
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'تحقق من البيانات',
        text: 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('username', this.userForm.get('username')?.value.trim());
    formData.append('email', this.userForm.get('email')?.value.trim());
    formData.append('password', this.userForm.get('password')?.value);
    formData.append('phone', this.userForm.get('phone')?.value.trim());
    formData.append('userType', this.userForm.get('userType')?.value.toString());
    formData.append('bioAr', this.userForm.get('bioAr')?.value.trim());
    formData.append('bioEn', this.userForm.get('bioEn')?.value.trim());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.userService.addUser(formData).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        if (res.status) {
          Swal.fire({
            icon: 'success',
            title: 'تمت الإضافة بنجاح!',
            text: 'تم إضافة المستخدم الجديد بنجاح.',
            showConfirmButton: false,
            timer: 2000
          });
          this.userForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'خطأ في العملية',
            text: res.message || 'حدث خطأ غير متوقع أثناء إضافة المستخدم.'
          });
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'فشل الإضافة',
          text: 'حدث خطأ أثناء محاولة إضافة المستخدم. برجاء المحاولة لاحقًا.'
        });
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }
}
