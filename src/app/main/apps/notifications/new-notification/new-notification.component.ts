import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { NotificationListService } from "../notification-list.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CoreTranslationService } from "@core/services/translation.service";
import { locale as english } from "app/main/apps/notifications/i18n/en";
import { locale as arabic } from "app/main/apps/notifications/i18n/ar";

@Component({
  selector: "new-notification",
  templateUrl: "./new-notification.component.html",
})
export class NewNotificationComponent implements OnInit {
  public isLoading = false;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true,
  });
  selectedFiles;
  selectedFile;
  notificationForm: FormGroup;
  currentItem;
  imageUrl;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _notificationListService: NotificationListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.notificationForm = this.formBuilder.group({
      id: [""],
      title: ["", [Validators.required]],
      titleAr: ["", [Validators.required]],
      body: ["", [Validators.required]],
      bodyAr: ["", [Validators.required]],
    });

    const itemId = this.route.snapshot.paramMap.get("id");
    if (itemId) {
      this.currentItem = itemId;
      this.notificationForm.get("id").setValue(itemId);
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
    this._notificationListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.notificationForm.get("imageUrl").setValue(response.innerData.url);
    });
  }

  deleteImage() {
    this.notificationForm.get("imageUrl").setValue(null);
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
    if (this.notificationForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }
    } else {
      console.log("Form is invalid. Please check the fields.");
      this.notificationForm.markAllAsTouched();
    }
  }

  getItem(id: string) {
    this._notificationListService.getItem(id).then((respone: any) => {
      this.notificationForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.imageUrl;
    });
  }

  /**
   * Handle Api's Calls
   */

  saveItem() {
    this._notificationListService.addItem(this.notificationForm.value).then((response) => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  updateItem() {
    this._notificationListService.updateItem(this.notificationForm.value).then((response) => {
      this.isLoading = false;
      if (response.status) {
        this.back();
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
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
}
