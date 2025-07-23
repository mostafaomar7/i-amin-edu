import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/users/instructors/i18n/en';
import { locale as arabic } from 'app/main/users/instructors/i18n/ar';
import { SubjectListService } from 'app/main/apps/subjects/subject-list.service';
import { PortalListService } from 'app/main/apps/portals/portal-list.service';
import { InstructorsListService } from '../instructors-list.service';
import { PermissionListService } from '../../permissions/permission-list.service';
import { Role } from 'app/auth/models';

@Component({
  selector: 'new-instructors',
  templateUrl: './new-instructors.component.html'
})
export class NewInstructorsComponent implements OnInit {

  public isLoading = true;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  teacherForm: FormGroup;
  currentItem;
  image;

  educationalGates: any;
  subjects: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _instructorsListService: InstructorsListService,
    private _portalListService: PortalListService,
    private _subjectListService: SubjectListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService,
    private _permissionListService: PermissionListService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {

    this.teacherForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: [''],
      phone: ['', [Validators.required]],
      accountStatus: ['', [Validators.required]],
      subjectId: ['', [Validators.required]],
      educationalPortalId: ['', [Validators.required]],
      experienceEn: ['', [Validators.required]],
      experienceAr: ['', [Validators.required]],
      image: ['', [Validators.required]],
      centerId: ['']
    });

    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.currentItem = itemId;
      this.teacherForm.get('id').setValue(itemId);
      this.getItem(itemId);
    }

    this.getSubjects()
    this.getGates()
  }

  onStatusChange(): void { }

  onSubjectChange(): void { }

  onGateChange(): void { }

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile)
    this._instructorsListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.teacherForm.get("image").setValue(response.innerData.url);
    })
  }

  deleteImage() {
    this.teacherForm.get("image").setValue(null);
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
    console.log(this.teacherForm.value);
    if (this.teacherForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.teacherForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._instructorsListService.getItem(id).then((respone: any) => {
      this.teacherForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.user.image;
      this.teacherForm.get("firstName").setValue(respone.innerData.user.firstName);
      this.teacherForm.get("lastName").setValue(respone.innerData.user.lastName);
      this.teacherForm.get("email").setValue(respone.innerData.user.email);
      this.teacherForm.get("phone").setValue(respone.innerData.user.phone);
      this.teacherForm.get("accountStatus").setValue(respone.innerData.user.accountStatus);
      this.teacherForm.get("image").setValue(respone.innerData.user.image);
      this.teacherForm.get("id").setValue(respone.innerData.userId);

    })
  }

  /**
 * Handle Api's Calls
 */

  async saveItem() {
    var centerId = 0;
    switch (this._permissionListService.getRoleType()) {
      case Role.Admin:
        break
      default:
        centerId = JSON.parse(localStorage.getItem('userData')).id;
        break
    }
    this.teacherForm.get("centerId").setValue(centerId);
    await this._instructorsListService.addItem(this.teacherForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    var centerId = 0;
    switch (this._permissionListService.getRoleType()) {
      case Role.Admin:
        break
      default:
        centerId = JSON.parse(localStorage.getItem('userData')).id;
        break
    }
    this.teacherForm.get("centerId").setValue(centerId);

    await this._instructorsListService.updateItem(this.teacherForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    })
  }

  async getGates() {
    await this._portalListService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.educationalGates = response.innerData;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async getSubjects() {
    await this._subjectListService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.subjects = response.innerData;
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