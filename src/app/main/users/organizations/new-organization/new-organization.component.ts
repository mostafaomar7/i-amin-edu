import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { OrganizationListService } from '../organization-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/organizations/i18n/en';
import { locale as arabic } from 'app/main/users/organizations/i18n/ar';

@Component({
  selector: 'new-organization',
  templateUrl: './new-organization.component.html'
})
export class NewOrganizationComponent implements OnInit {

  public isLoading = false;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  organizationForm: FormGroup;
  currentItem;
  image;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _organizationListService: OrganizationListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {

    this.organizationForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      commission: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: [''],
      accountStatus: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.currentItem = itemId;
      this.organizationForm.get('id').setValue(itemId);
      this.getItem(itemId);
    }
  }

  onStatusChange(): void { }

  onRoleChange(): void { }

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile)
    this._organizationListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.organizationForm.get("image").setValue(response.innerData.url);
    })
  }

  deleteImage() {
    this.organizationForm.get("image").setValue(null);
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
    console.log(this.organizationForm.value);
    if (this.organizationForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.organizationForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._organizationListService.getItem(id).then((respone: any) => {
      this.organizationForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.user.image;
      this.organizationForm.get("firstName").setValue(respone.innerData.user.firstName);
      this.organizationForm.get("lastName").setValue(respone.innerData.user.lastName);
      this.organizationForm.get("commission").setValue(respone.innerData.commission);
      this.organizationForm.get("email").setValue(respone.innerData.user.email);
      this.organizationForm.get("accountStatus").setValue(respone.innerData.user.accountStatus);
      this.organizationForm.get("image").setValue(respone.innerData.user.image);
      this.organizationForm.get("id").setValue(respone.innerData.userId);
      this.organizationForm.get("password").setValue(respone.innerData.password);
    })
  }

  /**
 * Handle Api's Calls
 */

  async saveItem() {
    console.log(this.organizationForm.value);

    await this._organizationListService.addItem(this.organizationForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    console.log(this.organizationForm.value);

    await this._organizationListService.updateItem(this.organizationForm.value).then(response => {
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