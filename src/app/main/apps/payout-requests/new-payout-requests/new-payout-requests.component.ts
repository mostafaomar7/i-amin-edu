import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CoreTranslationService } from '@core/services/translation.service';
import { locale as english } from 'app/main/apps/payout-requests/i18n/en';
import { locale as arabic } from 'app/main/apps/payout-requests/i18n/ar';
import { PayoutRequestsListService } from '../new-payout-requests-list.service';

@Component({
  selector: 'new-payout-requests',
  templateUrl: './new-payout-requests.component.html'
})
export class NewPayoutRequestsComponent implements OnInit {

  public isLoading = false;

  public uploader: FileUploader = new FileUploader({
    url: "URL",
    isHTML5: true
  });
  selectedFiles;
  selectedFile;
  gateForm: FormGroup;
  currentItem;
  imageUrl;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private formBuilder: FormBuilder,
    private payoutRequestsListService: PayoutRequestsListService,
    private router: Router,
    private route: ActivatedRoute,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {

    this.gateForm = this.formBuilder.group({
      id: [''],
      slug: ['', [Validators.required]],
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      titleEn: ['', [Validators.required]],
      titleAr: ['', [Validators.required]],
      active: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    });

    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.currentItem = itemId;
      this.gateForm.get('id').setValue(itemId);
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
    this.payoutRequestsListService.uploadImage(imageFile).then((response: any) => {
      console.log(response);
      this.gateForm.get("imageUrl").setValue(response.innerData.url);
    })
  }

  deleteImage() {
    this.gateForm.get("imageUrl").setValue(null);
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
    if (this.gateForm.valid) {
      this.isLoading = true;
      if (this.currentItem) {
        this.updateItem();
      } else {
        this.saveItem();
      }

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.gateForm.markAllAsTouched();
    }
  }

  async getItem(id: string) {
    await this.payoutRequestsListService.getItem(id).then((respone: any) => {
      this.gateForm.patchValue(respone.innerData);
      this.selectedFile = respone.innerData.imageUrl;
    })
  }

  /**
 * Handle Api's Calls
 */

  async saveItem() {
    await this.payoutRequestsListService.addItem(this.gateForm.value).then(response => {
      this.isLoading = false;
      if (response.status) {
        this.back();
      } else {
        this.ConfirmColorOpen(response.message, false);
      }
    });
  }

  async updateItem() {
    await this.payoutRequestsListService.updateItem(this.gateForm.value).then(response => {
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
