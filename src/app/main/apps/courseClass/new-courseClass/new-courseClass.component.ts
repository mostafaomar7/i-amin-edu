// 🎯 انسخ كل الكود التالي واستبدله في ملف new-courseClass.component.ts

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/apps/courseClass/i18n/en';
import { locale as arabic } from 'app/main/apps/courseClass/i18n/ar';
import { CourseClassListService } from '../courseClass-list.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'new-courseClass',
  templateUrl: './new-courseClass.component.html',
})
export class NewCourseClassComponent implements OnInit {
  @ViewChild('videoFileInput') videoFileInput: ElementRef | undefined;

  public isLoading = false;
  public newItemForm: FormGroup;
  public courseId: string;
  public currentItem: any;

  public selectedFile: File | null = null;
  public selectedFileName: string = '';
  public videoPreviewUrl: SafeUrl | null = null;
  public uploadProgressValue = 0;
  public uploadProgress: 'default' | 'uploading' | 'complete' | 'error' = 'default';

  constructor(
    private formBuilder: FormBuilder,
    private _courseClassListService: CourseClassListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService,
    private sanitizer: DomSanitizer
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.newItemForm = this.formBuilder.group({
      id: [''],
      courseId: [''],
      nameEn: ['', [Validators.required]],
      duration: [{ value: '', disabled: true }, [Validators.required]],
      classStatus: ['1', [Validators.required]],
      // --- بداية التعديل: إعادة إضافة هذا السطر ---
      mediaUrl: [''], 
      // --- نهاية التعديل ---
    });

    this.route.queryParams.subscribe((params) => {
      this.courseId = params['id'];
      this.newItemForm.get('courseId').setValue(this.courseId);
    });

    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.currentItem = itemId;
      this.getItem(itemId);
    }

    this._courseClassListService.uploadProgress$.subscribe((progress) => {
      this.uploadProgressValue = progress;
    });
  }

  onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;
  this.selectedFileName = file.name;
  this.videoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  this.uploadProgress = 'default';

  const video = document.createElement('video');
  video.preload = 'metadata';
  video.src = URL.createObjectURL(file);
  video.onloadedmetadata = () => {
    URL.revokeObjectURL(video.src);

    const durationInSeconds = Math.floor(video.duration);
    const durationInMinutes = Math.ceil(durationInSeconds / 60); // ⬅️ التحويل لدقايق (مقرب لأعلى)

    // تحديث قيمة الحقل حتى لو disabled
    this.newItemForm.get('duration').setValue(durationInMinutes);
  };
}




  async onSubmit() {
  if (this.newItemForm.invalid) {
    this.newItemForm.markAllAsTouched();
    this.ConfirmColorOpen('Please fill all required fields.', false);
    return;
  }

  this.isLoading = true;

  try {
    // نجمع قيمة الفورم + duration حتى لو disabled
    const formData = {
      ...this.newItemForm.getRawValue(), // getRawValue بترجع كل الحقول حتى المعطلة
    };

    if (this.currentItem) {
      const response = await this._courseClassListService.updateItem(formData);
      this.handleResponse(response, true);
    } else {
      if (this.selectedFile) {
        this.uploadProgress = 'uploading';
        const response = await this._courseClassListService.uploadVideoAndCreateClass(
          this.selectedFile,
          formData
        );
        this.handleResponse(response, true);
        this.uploadProgress = response?.status ? 'complete' : 'error';
      } else {
        this.ConfirmColorOpen('Please select a video file to create a new class.', false);
      }
    }
  } catch (error) {
    console.error('Submission process failed', error);
    this.ConfirmColorOpen('An unexpected error occurred.', false);
  } finally {
    this.isLoading = false;
  }
}

  // دالة مساعدة لتجنب تكرار الكود
  handleResponse(response: any, navigateOnSuccess: boolean) {
    if (response && response.status) {
      if (navigateOnSuccess) {
          this.router.navigate(['/apps/courses/list/view'], { queryParams: { id: this.courseId } });
      }
    } else {
      this.ConfirmColorOpen(response?.message || 'An error occurred.', false);
    }
  }

  async getItem(id: string) {
    const response = await this._courseClassListService.getItem(id);
    if (response.status) {
      this.newItemForm.patchValue(response.innerData);
    }
  }
  
  back() {
    this.router.navigate(['/apps/courses/list/view'], { queryParams: { id: this.courseId } });
  }
  
  ConfirmColorOpen(message: string, isSuccess: boolean) {
    Swal.fire({
      title: isSuccess ? 'Success!' : 'Failed!',
      text: message,
      icon: isSuccess ? 'success' : 'error',
      customClass: { confirmButton: 'btn btn-success' },
    });
  }
}