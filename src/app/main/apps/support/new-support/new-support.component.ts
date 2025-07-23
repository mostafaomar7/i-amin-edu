import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { SupportListService } from "../support-list.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CoreTranslationService } from "@core/services/translation.service";
import { locale as english } from "app/main/apps/support/i18n/en";
import { locale as arabic } from "app/main/apps/support/i18n/ar";

@Component({
  selector: "new-support",
  templateUrl: "./new-support.component.html",
})
export class NewSupportComponent implements OnInit {
  public isLoading = false;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true,
  });
  selectedFiles;
  selectedFile;
  supportForm: FormGroup;
  currentItem;
  imageUrl;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _supportListService: SupportListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.supportForm = this.formBuilder.group({
      id: [""]
    });

    const itemId = this.route.snapshot.paramMap.get("id");
    if (itemId) {
      this.currentItem = itemId;
      this.supportForm.get("id").setValue(itemId);
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
    this._supportListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.supportForm.get("imageUrl").setValue(response.innerData.url);
    });
  }

  deleteImage() {
    this.supportForm.get("imageUrl").setValue(null);
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
    if (this.supportForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }
    } else {
      console.log("Form is invalid. Please check the fields.");
      this.supportForm.markAllAsTouched();
    }
  }

  getItem(id: string) {
    this._supportListService.getItem(id).then((respone: any) => {
      this.supportForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.imageUrl;
    });
  }

  /**
   * Handle Api's Calls
   */

  saveItem() {
    this._supportListService
      .addItem(this.supportForm.value)
      .then((response) => {
        this.isLoading = false;
        if (response.status) {
          this.back();
        } else {
          this.ConfirmColorOpen(response.message, false);
        }
      });
  }

  updateItem() {
    this._supportListService
      .updateItem(this.supportForm.value)
      .then((response) => {
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
