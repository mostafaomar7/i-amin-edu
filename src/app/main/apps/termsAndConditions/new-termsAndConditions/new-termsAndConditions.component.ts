import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { TermsAndConditionsListService } from "../termsAndConditions-list.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CoreTranslationService } from "@core/services/translation.service";
import { locale as english } from "app/main/apps/termsAndConditions/i18n/en";
import { locale as arabic } from "app/main/apps/termsAndConditions/i18n/ar";

@Component({
  selector: "new-termsAndConditions",
  templateUrl: "./new-termsAndConditions.component.html",
})
export class NewTermsAndConditionsComponent implements OnInit {
  public isLoading = false;

  termsAndConditionsForm: FormGroup;
  currentItem;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private _termsAndConditionsListService: TermsAndConditionsListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.termsAndConditionsForm = this.formBuilder.group({
      id: [""],
      title: ["", [Validators.required]],
      titleAr: ["", [Validators.required]],
      body: ["", [Validators.required]],
      bodyAr: ["", [Validators.required]],
    });

    const itemId = this.route.snapshot.paramMap.get("id");
    if (itemId) {
      this.currentItem = itemId;
      this.termsAndConditionsForm.get("id").setValue(itemId);
      this.getItem(itemId);
    }
  }

  onStatusChange(): void {}

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
    if (this.termsAndConditionsForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }
    } else {
      console.log("Form is invalid. Please check the fields.");
      this.termsAndConditionsForm.markAllAsTouched();
    }
  }

  getItem(id: string) {
    this._termsAndConditionsListService.getItem(id).then((respone: any) => {
      this.termsAndConditionsForm.patchValue(respone.innerData[0]);
    });
  }

  /**
   * Handle Api's Calls
   */

  saveItem() {
    this._termsAndConditionsListService
      .addItem(this.termsAndConditionsForm.value)
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
    this._termsAndConditionsListService
      .updateItem(this.termsAndConditionsForm.value)
      .then((response) => {
        this.isLoading = false;
        if (response.status) {
          this.ConfirmColorOpen(response.message, true);
        } else {
          this.ConfirmColorOpen(response.message, false);
        }
      });
  }

  /**
   * Handle Naviation
   */
  back() {
    // if (this.currentItem) {
    //   this.router.navigate(["../"], { relativeTo: this.route });
    // } else {
    //   this.router.navigate(["../"], { relativeTo: this.route });
    // }
  }
}
