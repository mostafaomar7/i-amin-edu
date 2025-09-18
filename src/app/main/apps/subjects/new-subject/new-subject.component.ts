import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { SubjectListService } from '../subject-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/apps/subjects/i18n/en';
import { locale as arabic } from 'app/main/apps/subjects/i18n/ar';

@Component({
  selector: 'new-subject',
  templateUrl: './new-subject.component.html'
})
export class NewSubjectComponent implements OnInit {

  public isLoading = false;
  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  subjectForm: FormGroup;
  currentItem;
  imageUrl;

  constructor(
    private formBuilder: FormBuilder,
    private _subjectListService: SubjectListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.subjectForm = this.formBuilder.group({
      id: [''],
      slug: ['', [Validators.required]],
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      titleEn: ['', [Validators.required]],
      titleAr: ['', [Validators.required]],
      active: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      minPrice: ['', [Validators.required, Validators.min(1)]], // > 0
      maxPrice: ['', [Validators.required, Validators.min(1)]]  // > 0
    }, { validators: priceRangeValidator() });

    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.currentItem = itemId;
      this.subjectForm.get('id').setValue(itemId);
      this.getItem(itemId);
    }
  }

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile);
    this._subjectListService.uploadImage(imageFile).then((response: any) => {
      this.subjectForm.get("imageUrl").setValue(response.innerData.url);
    })
  }

  deleteImage() {
    this.subjectForm.get("imageUrl").setValue(null);
    this.selectedFile = null;
  }

  ConfirmColorOpen(message: string, isSuccess: boolean) {
    Swal.fire({
      title: (isSuccess) ? 'Success!' : 'Failed!',
      text: message,
      icon: (isSuccess) ? 'success' : 'error',
      customClass: {
        confirmButton: 'btn btn-success'
      }
    });
  }

  onSubmit() {
    if (this.subjectForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }
    } else {
      this.subjectForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._subjectListService.getItem(id).then((respone: any) => {
      this.subjectForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.imageUrl;
    })
  }

  async saveItem() {
    await this._subjectListService.addItem(this.subjectForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    await this._subjectListService.updateItem(this.subjectForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    })
  }

  back() {
    if (this.currentItem) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  // 🔹 التحقق من السعر الأدنى
  onMinSliderChange(event: any) {
    const value = Math.max(1, +event.target.value); 
    this.subjectForm.get('minPrice').setValue(value);

    if (value >= this.subjectForm.get('maxPrice').value) {
      this.subjectForm.get('maxPrice').setValue(value + 100);
    }
  }

  // 🔹 التحقق من السعر الأعلى
  onMaxSliderChange(event: any) {
    const value = Math.max(1, +event.target.value);
    this.subjectForm.get('maxPrice').setValue(value);

    if (value <= this.subjectForm.get('minPrice').value) {
      this.subjectForm.get('minPrice').setValue(Math.max(1, value - 100));
    }
  }

  // 🔹 التحقق عند الإدخال اليدوي
  onPriceInputChange() {
    let min = Math.max(1, this.subjectForm.get('minPrice').value);
    let max = Math.max(1, this.subjectForm.get('maxPrice').value);

    this.subjectForm.get('minPrice').setValue(min, { emitEvent: false });
    this.subjectForm.get('maxPrice').setValue(max, { emitEvent: false });

    if (min >= max) {
      this.subjectForm.get('maxPrice').setValue(min + 100);
    }
  }
}

/** 🔹 Validator مخصص للأسعار */
export function priceRangeValidator(): ValidatorFn {
  return (group: AbstractControl): { [key: string]: boolean } | null => {
    const min = group.get('minPrice')?.value;
    const max = group.get('maxPrice')?.value;

    if (min != null && max != null && min >= max) {
      return { priceRangeInvalid: true };
    }
    return null;
  };
}
