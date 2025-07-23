import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { AdminListService } from '../admin-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/admins/i18n/en';
import { locale as arabic } from 'app/main/users/admins/i18n/ar';
import { SubjectListService } from 'app/main/apps/subjects/subject-list.service';
import { PortalListService } from 'app/main/apps/portals/portal-list.service';
import { PermissionListService } from '../../permissions/permission-list.service';

@Component({
  selector: 'new-admin',
  templateUrl: './new-admin.component.html'
})
export class NewAdminComponent implements OnInit {

  public isLoading = true;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  adminForm: FormGroup;
  currentItem;
  image;

  roles: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _adminListService: AdminListService,
    private _permissionsService: PermissionListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {

    //   {
    //     // user Data
    //     "firstName": "Bola",
    //     "lastName": "Ibrahim",

    //     "phone": "01212057434",
    //     "email": "admin2@iamin.com",
    //     "image": "", 
    //     "password": "Test1234",
    //     "accountStatus": 2,
    //     "roleId": 1
    // }

    this.adminForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: [''],
      accountStatus: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.currentItem = itemId;
      this.adminForm.get('id').setValue(itemId);
      this.getItem(itemId);
    }

    this.getRoles()
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
    this._adminListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.adminForm.get("image").setValue(response.innerData.url);
    })
  }

  deleteImage() {
    this.adminForm.get("image").setValue(null);
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
    console.log(this.adminForm.value);
    if (this.adminForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.adminForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._adminListService.getItem(id).then((respone: any) => {
      this.adminForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.user.image;
      this.adminForm.get("firstName").setValue(respone.innerData.user.firstName);
      this.adminForm.get("lastName").setValue(respone.innerData.user.lastName);
      this.adminForm.get("email").setValue(respone.innerData.user.email);
      this.adminForm.get("accountStatus").setValue(respone.innerData.user.accountStatus);
      this.adminForm.get("image").setValue(respone.innerData.user.image);
      this.adminForm.get("id").setValue(respone.innerData.userId);
    })
  }

  /**
 * Handle Api's Calls
 */

  async saveItem() {
    console.log(this.adminForm.value);

    await this._adminListService.addItem(this.adminForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    console.log(this.adminForm.value);

    await this._adminListService.updateItem(this.adminForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    })
  }

  async getRoles() {
    await this._permissionsService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.roles = response.innerData;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
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