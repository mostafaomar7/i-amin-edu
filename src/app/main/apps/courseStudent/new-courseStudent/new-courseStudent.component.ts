import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CoreTranslationService } from "@core/services/translation.service";
import { locale as english } from "app/main/apps/courseStudent/i18n/en";
import { locale as arabic } from "app/main/apps/courseStudent/i18n/ar";
import { CourseStudentListService } from "../courseStudent-list.service";

@Component({
  selector: "new-courseStudent",
  templateUrl: "./new-courseStudent.component.html",
})
export class NewCourseStudentComponent implements OnInit {
  public isLoading = false;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true,
  });
  selectedFiles;
  selectedFile;
  newItemForm: FormGroup;
  currentItem;
  imageUrl;
  courseId;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _courseStudentListService: CourseStudentListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.newItemForm = this.formBuilder.group({
      id: [""],
      courseId: [""],
      nameEn: ["", [Validators.required]],
      duration: ["", [Validators.required]],
      classStatus: ["", [Validators.required]],
      mediaUrl: ["", [Validators.required]],
    });

    this.route.queryParams.subscribe((params) => {
      const itemId = params["id"];
      this.newItemForm.get("courseId").setValue(itemId);
      this.courseId = itemId;
    });

    const itemId = this.route.snapshot.paramMap.get("id");
    if (itemId) {
      this.currentItem = itemId;
      this.newItemForm.get("id").setValue(itemId);
      this.getItem(itemId);
    }
  }

  onStatusChange(): void {}

  onFileSelected(event: any): void {
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return (this.selectedFile = fileReader.result);
    };
    fileReader.readAsDataURL(imageFile);
    this.newItemForm.get("mediaUrl").setValue(null);
    this.selectedFile = null;

    this._courseStudentListService
      .uploadImage(imageFile)
      .then((response: any) => {
        console.log(response);
        this.newItemForm.get("mediaUrl").setValue(response.innerData.url);
        this.selectedFile = response.innerData.url;
      });
  }

  deleteImage() {
    this.newItemForm.get("mediaUrl").setValue(null);
    this.selectedFile = null;
  }

  ConfirmColorOpen(message: string, isSuccess: boolean) {
    Swal.fire({
      title: isSuccess ? "Success!" : "Failed!",
      text: message,
      icon: isSuccess ? "success" : "error",
      customClass: {
        confirmButton: "btn btn-success",
      },
    });
  }

  onSubmit() {
    if (this.newItemForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }
    } else {
      console.log("Form is invalid. Please check the fields.");
      this.newItemForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this._courseStudentListService.getItem(id).then((respone: any) => {
      this.newItemForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.mediaUrl;
    });
  }

  /**
   * Handle Api's Calls
   */

  async saveItem() {
    await this._courseStudentListService
      .addItem(this.newItemForm.value)
      .then((response) => {
        this.isLoading = false;
        if (response.status) {
          this.router.navigate(["/apps/courses/list/view"], {
            queryParams: { id: this.courseId },
          });
        } else {
          this.ConfirmColorOpen(response.message, false);
        }
      });
  }

  async updateItem() {
    await this._courseStudentListService
      .updateItem(this.newItemForm.value)
      .then((response) => {
        this.isLoading = false;
        if (response.status) {
          this.router.navigate(["/apps/courses/list/view"], {
            queryParams: { id: this.courseId },
          });
        } else {
          this.ConfirmColorOpen(response.message, false);
        }
      });
  }

  /**
   * Handle Naviation
   */
  back() {
    this.router.navigate(["/apps/courses/list/view"], {
      queryParams: { id: this.courseId },
    });
    // if (this.currentItem) {
    //   this.router.navigate(['../../'], { relativeTo: this.route });
    // } else {
    //   this.router.navigate(['../'], { relativeTo: this.route });
    // }
  }
}
