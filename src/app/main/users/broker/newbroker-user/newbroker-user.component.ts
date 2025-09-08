import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from './en';
import { locale as arabic } from './ar';

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

      // معاينة الصورة
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
    alert('Please fill all required fields correctly.');
    return;
  }

  const payload: any = {
  username: this.userForm.get('username')?.value.trim(),
  email: this.userForm.get('email')?.value.trim(),
  password: this.userForm.get('password')?.value,
  phone: this.userForm.get('phone')?.value.trim(),
  userType: Number(this.userForm.get('userType')?.value), // تحويل للقيمة رقم
  bioAr: this.userForm.get('bioAr')?.value.trim(),
  bioEn: this.userForm.get('bioEn')?.value.trim()
};

if (this.imagePreview) {
  payload.image = this.imagePreview.toString();
}

  this.userService.addUser(payload).subscribe({
    next: (res: any) => {
      console.log('API Response:', res);
      if (res.status) {
        alert('User added successfully!');
        this.userForm.reset();
        this.selectedFile = null;
        this.imagePreview = null;
      } else {
        alert('Error: ' + res.message);
      }
    },
    error: (err) => {
      console.error('HTTP Error:', err);
      alert('Something went wrong while adding the user.');
    }
  });
}


  // دالة سهلة للوصول للحقول في HTML
  get f() {
    return this.userForm.controls;
  }
}
