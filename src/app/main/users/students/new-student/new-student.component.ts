import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { StudentListService } from '../student-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/students/i18n/en';
import { locale as arabic } from 'app/main/users/students/i18n/ar';

@Component({
  selector: 'new-student',
  templateUrl: './new-student.component.html'
})
export class NewStudentComponent implements OnInit {

  public isLoading = false;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  studentForm: FormGroup;
  currentItem;
  image;


  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _studentListService: StudentListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {

    this.studentForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      accountStatus: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.currentItem = itemId;
      this.studentForm.get('id').setValue(itemId);
      this.getItem(itemId);
    }

  }

  onStatusChange(): void { }

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile)
    this._studentListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.studentForm.get("image").setValue(response.innerData.url);
    })
  }

  deleteImage() {
    this.studentForm.get("image").setValue(null);
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
    console.log(this.studentForm.value);
    if (this.studentForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.studentForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._studentListService.getItem(id).then((respone: any) => {
      this.studentForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.user.image;
      this.studentForm.get("firstName").setValue(respone.innerData.user.firstName);
      this.studentForm.get("lastName").setValue(respone.innerData.user.lastName);
      this.studentForm.get("email").setValue(respone.innerData.user.email);
      this.studentForm.get("phone").setValue(respone.innerData.user.phone);
      this.studentForm.get("accountStatus").setValue(respone.innerData.user.accountStatus);
      this.studentForm.get("image").setValue(respone.innerData.user.image);
      this.studentForm.get("id").setValue(respone.innerData.userId);

    })
  }

  /**
 * Handle Api's Calls
 */

  async saveItem() {
    console.log(this.studentForm.value);

    await this._studentListService.addItem(this.studentForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    console.log(this.studentForm.value);

    await this._studentListService.updateItem(this.studentForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    })
  }

  /**
   * Handle Naviation
   */
  back() {
    if (this.currentItem) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}