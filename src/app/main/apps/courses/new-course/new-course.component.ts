import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { CourseListService } from '../course-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/apps/courses/i18n/en';
import { locale as arabic } from 'app/main/apps/courses/i18n/ar';
import { CoreConfigService } from '@core/services/config.service';
import { SubjectListService } from '../../subjects/subject-list.service';
import { PortalListService } from '../../portals/portal-list.service';
import { StageListService } from '../../stages/stage-list.service';
import { InstructorsListService } from 'app/main/users/instructors/instructors-list.service';
import { PermissionListService } from 'app/main/users/permissions/permission-list.service';
import { Role } from 'app/auth/models';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.css'],
})
export class NewCourseComponent implements OnInit {

  public isLoading = false;
  public locale: any;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  selectedVideo;
  courseForm: FormGroup;
  currentItem;
  coverImage;
  educationalPoratals: any;
  subjects: any;
  stages: any;
  teachers: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private formBuilder: FormBuilder,
    private _courseListService: CourseListService,
    private _subjectListService: SubjectListService,
    private _portalListService: PortalListService,
    private _stageListService: StageListService,
    private _instructorsListService: InstructorsListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService,
    private _permissionListService: PermissionListService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }
   public userType: number;
   public instructorId: number;

  ngOnInit(): void {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.userType = userData?.userType;
  this.instructorId = userData?.id;

    this.courseForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      info: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      price: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
      coverImage: ['', [Validators.required]],
      // introVideo: ['', [Validators.required]],
      subjectId: ['', [Validators.required]],
      stageId: ['', [Validators.required]],
      teacherId: ['', [Validators.required]],
      educationalPortalId: ['', [Validators.required]],
      centerId: ['']
    });
    if (this.userType === 3) {
      this.courseForm.get('teacherId').setValue(this.instructorId);
      this.courseForm.get('isActive').setValue(false); // إجبار الحالة على not active
    }

    if (this.userType === 3) {
      this.courseForm.get('teacherId').setValue(this.instructorId);
    }
    this._coreConfigService.config.subscribe(config => {
      this.locale = config.app.appLanguage;
    });
    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.currentItem = itemId;
      this.courseForm.get('id').setValue(itemId);
      this.getItem(itemId);
    }

    this.getSubjects()
    this.getPortals()
    this.getStages()
    this.getTeachers()
  }

  onStatusChange(): void { }

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return this.selectedFile = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile)
    this._courseListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.courseForm.get("coverImage").setValue(response.innerData.url);
    })
  }

  deleteImage() {
    this.courseForm.get("coverImage").setValue(null);
    this.selectedFile = null;
  }

  onVideoSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return this.selectedVideo = fileReader.result;
    };
    fileReader.readAsDataURL(imageFile)
    this._courseListService.uploadVideo(imageFile).then((response: any) => {
      console.log(response);
      this.courseForm.get("introVideo").setValue(response.innerData.url);
    })
  }

  deleteVideo() {
    this.courseForm.get("introVideo").setValue(null);
    this.selectedVideo = null;
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
    console.log('course form >>', this.courseForm);
    if (this.courseForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.courseForm.markAllAsTouched();
    }
  }
 onGateChange(type: string, event: any): void {
  console.log(`تم تغيير ${type}:`, event.target.value);
}

  async getItem(id: string) {
    await this._courseListService.getItem(id).then((respone: any) => {
      this.courseForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.coverImage;
      this.courseForm.get('name').setValue(this.locale === 'en' ? respone.innerData.nameEn : respone.innerData.nameAr)
      this.courseForm.get('info').setValue(this.locale === 'en' ? respone.innerData.infoEn : respone.innerData.infoAr)
      this.courseForm.get('isActive').setValue(respone.innerData.isActive)
    })
  }

  onSubjectChange(): void { }


  /**
 * Handle Api's Calls
 */

async saveItem() {
  const formData = { ...this.courseForm.value };

  // احذف centerId لو فاضي أو null
  if (!formData.centerId) {
    delete formData.centerId;
  }

  console.log('Sending course data:', formData);

  this.isLoading = true;
  await this._courseListService.addItem(formData).then(response => {
    this.isLoading = false;
    if (response.status) {
      this.back();
    } else {
      this.ConfirmColorOpen(response.message, false);
    }
  }).catch(error => {
    this.isLoading = false;
    console.error('Add course error:', error);
    this.ConfirmColorOpen('حدث خطأ أثناء الإضافة', false);
  });
}

async updateItem() {
  const formData = { ...this.courseForm.value };

  // احذف centerId لو فاضي أو null
  if (!formData.centerId) {
    delete formData.centerId;
  }

  this.isLoading = true;
  await this._courseListService.updateItem(formData).then(response => {
    this.isLoading = false;
    if (response.status) {
      this.back();
    } else {
      this.ConfirmColorOpen(response.message, false);
    }
  }).catch(error => {
    this.isLoading = false;
    console.error('Update course error:', error);
    this.ConfirmColorOpen('حدث خطأ أثناء التعديل', false);
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

  async getPortals() {
    await this._portalListService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.educationalPoratals = response.innerData;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async getStages() {
    await this._stageListService.getDataTableRows().then(response => {
      this.isLoading = false;
      if (response.status) {
        this.stages = response.innerData;
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async getTeachers() {
    var centerId = 0;
    switch (this._permissionListService.getRoleType()) {
      case Role.Admin:
        break
      default:
        centerId = JSON.parse(localStorage.getItem('userData')).id;
        break
    }
    await this._instructorsListService.getDataTableRows(centerId).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.teachers = response.innerData;
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


  onInput(value: string) {
    const autocompleteList = document.getElementById('teacherAutocomplete');
    if (!autocompleteList) return;

    // Simulate fetching data from a server
    const teachers = this.teachers.filter(item => item.user.firstName.toLowerCase().includes(value.toLowerCase()));

    // Clear previous suggestions
    autocompleteList.innerHTML = '';

    // Add new suggestions
    teachers.forEach(teacher => {
      const item = document.createElement('div');
      item.classList.add('autocomplete-item');
      item.innerText = teacher.user.firstName;
      item.addEventListener('click', () => {
        this.courseForm.get('teacherId').setValue(teacher.user.firstName);
        autocompleteList.innerHTML = '';
      });
      autocompleteList.appendChild(item);
    });

    // Show or hide the autocomplete list
    autocompleteList.style.display = teachers.length > 0 ? 'block' : 'none';
  }

}
