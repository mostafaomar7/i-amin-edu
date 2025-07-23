import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { PermissionListService } from '../permission-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/permissions/i18n/en';
import { locale as arabic } from 'app/main/users/permissions/i18n/ar';
import { SubjectListService } from 'app/main/apps/subjects/subject-list.service';
import { PortalListService } from 'app/main/apps/portals/portal-list.service';

@Component({
  selector: 'new-permission',
  templateUrl: './new-permission.component.html'
})
export class NewPermissionComponent implements OnInit {

  public isLoading = true;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });

  permissionForm: FormGroup;
  currentItem;
  image;

  educationalGates: any;
  subjects: any;
  allPermissions: any;
  updatedpermissions: any[] = []
  editedUpdatedpermissions: any[] = []
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _permissionListService: PermissionListService,
    private _portalListService: PortalListService,
    private _subjectListService: SubjectListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {

    this.permissionForm = this.formBuilder.group({
      id: [''],
      roleName: ['', Validators.required],
      permissionFormArray: this.formBuilder.array([

      ])
    });
    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.currentItem = itemId;
      this.permissionForm.get('id').setValue(itemId);
      this.getAllPermissions().then(() => {
        this.getItem(itemId)
      })

    } else {
      this.getAllPermissions()

    }


  }
  get permissionsFormArray() {
    return this.permissionForm.get('permissionFormArray') as FormArray
  }
  async getAllPermissions() {
    await this._permissionListService.getAllPermissions().then(response => {
      this.isLoading = false;
      if (response.innerData) {
        this.allPermissions = response.innerData;
        for (const permissionsKey of Object.keys(response.innerData)) {
          this.permissionsFormArray.push(new FormControl({ name: permissionsKey, permissions: response.innerData[permissionsKey] }))
        }
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }
  onChangePermission(action, ischecked) {
    if (ischecked === true) {
      action.selected = true;
      this.updatedpermissions.push(action);
    } else {
      this.updatedpermissions = this.updatedpermissions.filter((item => item.id !== action.id));
    }

  }
  async getItem(id: string) {
    await this._permissionListService.getItem(id).then((response: any) => {
      if (response && response.innerData) {
        this.permissionForm.get('roleName').setValue(response.innerData.roleName);
        const patchedValue = response.innerData.permissions;
        let allPermissionsArr: any[] = [];
        let checkedPermissionArr: any[] = [];
        let mappedPermissions = this.permissionsFormArray.value.map(item => item.permissions);
        for (let index = 0; index < mappedPermissions.length; index++) {
          allPermissionsArr.push(...mappedPermissions[index]);
        }
        for (const checkedPermission of Object.keys(patchedValue)) {
          checkedPermissionArr.push(...patchedValue[checkedPermission].map(checkedItem => checkedItem.id));

        }
        for (let index = 0; index < this.permissionsFormArray.controls.length; index++) {
          for (let y = 0; y < this.permissionsFormArray.controls[index].value.permissions.length; y++) {
            if (checkedPermissionArr.find(item => item === this.permissionsFormArray.controls[index].value.permissions[y].id)) {
              this.permissionsFormArray.controls[index].value.permissions[y].selected = true;
              this.updatedpermissions.push(this.permissionsFormArray.controls[index].value.permissions[y])

            }
          }

        }
      }


    })


  }

  onStatusChange(): void { }

  onSubjectChange(): void { }

  onGateChange(): void { }



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

    if (this.permissionForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.permissionForm.markAllAsTouched();
    }
  }



  /**
 * Handle Api's Calls
 */

  async saveItem() {
    console.log(this.permissionForm.value);
    const createpermission = {
      name: this.permissionForm.value.roleName,
      permissions: this.updatedpermissions.map((item: any) => item.id)

    }
    await this._permissionListService.addItem(createpermission).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    console.log(this.permissionForm.value);
    const gg = {
      name: this.permissionForm.value.roleName,
      id: this.permissionForm.value.id,
      permissions: this.updatedpermissions.map(item => item.id)
    }
    await this._permissionListService.updateItem(gg).then(response => {
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