// new-courseClass.component.ts

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {CoreTranslationService} from '@core/services/translation.service';
import {locale as english} from 'app/main/apps/courseClass/i18n/en';
import {locale as arabic} from 'app/main/apps/courseClass/i18n/ar';
import {CourseClassListService} from '../courseClass-list.service';
import {VimeoService, VimeoVideoUploadStatus} from '../../../../../@core/services/vimeo.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser'; // <-- 1. استيراد DomSanitizer و SafeUrl

@Component({
    selector: 'new-courseClass',
    templateUrl: './new-courseClass.component.html'
})
export class NewCourseClassComponent implements OnInit {
    @ViewChild('videoFileInput') videoFileInput: ElementRef | undefined;
    public isLoading = false;

    public uploader: FileUploader = new FileUploader({
        url: 'URL',
        isHTML5: true
    });
    selectedFiles;
    selectedFile;
    videoURL: string = '';
    videoPreviewUrl: SafeUrl | null = null; // <-- 2. إضافة متغير جديد لرابط الفيديو الآمن
    videoId: string = '';
    uploadProgress: VimeoVideoUploadStatus = 'default';
    uploadProgressValue = 0;
    newItemForm: FormGroup;
    currentItem;
    imageUrl;
    courseId;

    constructor(
        private formBuilder: FormBuilder,
        private _courseClassListService: CourseClassListService,
        private router: Router,
        private route: ActivatedRoute,
        private _coreTranslationService: CoreTranslationService,
        private vimeoService: VimeoService,
        private sanitizer: DomSanitizer // <-- 3. حقن (Inject) خدمة DomSanitizer
    ) {
        this._coreTranslationService.translate(english, arabic);
    }
    selectedFileName: string = '';
    ngOnInit(): void {

        this.newItemForm = this.formBuilder.group({
            id: [''],
            courseId: [''],
            nameEn: ['', [Validators.required]],
            duration: ['', [Validators.required]],
            classStatus: ['', [Validators.required]],
            mediaUrl: ['', [Validators.required]],
        });


        this.route.queryParams.subscribe(params => {
            const itemId = params['id'];
            this.newItemForm.get('courseId').setValue(itemId);
            this.courseId = itemId;
        });

        const itemId = this.route.snapshot.paramMap.get('id');
        if (itemId) {
            this.currentItem = itemId;
            this.newItemForm.get('id').setValue(itemId);
            this.getItem(itemId);
        }
    }

    onStatusChange(): void {
    }

    async onFileSelected(event: any): Promise<void> {
        const videoFile = event.target.files[0];
        if (!videoFile) {
            console.warn('❗ No file selected');
            return;
        }

        console.log('📥 File selected:', videoFile.name, videoFile.type);

        this.selectedFileName = videoFile.name;

        // <-- 4. تعديل هذا الجزء لإنشاء رابط آمن
        const unsafeUrl = URL.createObjectURL(videoFile);
        this.videoURL = unsafeUrl; // يمكنك الاحتفاظ به إذا احتجته
        this.videoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);

        this.uploadProgress = 'uploading';
        this.videoFileInput.nativeElement.disabled = true;

        try {
            const videoId = await this._courseClassListService.uploadVideoApiVideo(
                videoFile,
                this.courseId,
                this.newItemForm.get('classStatus').value
            );
            console.log('Received videoId:', videoId);
            if (videoId) {
                this.videoId = videoId;
                this.newItemForm.get('mediaUrl').setValue(videoId);
                this.uploadProgress = 'complete';
            } else {
                this.uploadProgress = 'error';
            }
        } catch (err) {
            this.uploadProgress = 'error';
        }


        this.videoFileInput.nativeElement.disabled = false;
    }


    handleVideoUploadProcess(): void {
        this.vimeoService.videoUploadStatus$.subscribe((status) => {
            this.videoFileInput.nativeElement.disabled = status.status === 'uploading';
            this.uploadProgressValue = status.progress;
            this.uploadProgress = status.status;
        });
    }

    handleVideoUpload(response: any): void {
        const arr = response.uri.split('/');
        this.videoId = arr[arr.length - 1];
        this.newItemForm.get('mediaUrl').setValue(this.videoId);
        this.selectedFile = null;
    }

    deleteVideo() {
        this.newItemForm.get('mediaUrl').setValue(null);
        this.selectedFile = null;
        this.videoId = '';
        this.videoURL = '';
        this.videoPreviewUrl = null; // <-- 5. قم بإفراغ الرابط الآمن عند الحذف

        // Reset the file input element
        if (this.videoFileInput) {
            this.videoFileInput.nativeElement.value = '';
        }
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
        if (this.newItemForm.valid) {
            this.isLoading = true;
            if (this.currentItem) {
                this.updateItem();
            } else {
                this.saveItem();
            }

        } else {
            console.log('Form is invalid. Please check the fields.');
            this.newItemForm.markAllAsTouched();
        }
    }

    async getItem(id: string) {
        await this._courseClassListService.getItem(id).then((respone: any) => {
            this.newItemForm.patchValue(respone.innerData);
            this.selectedFile = respone.innerData.mediaUrl;
        });
    }

    async saveItem() {
        await this._courseClassListService.addItem(this.newItemForm.value).then(response => {
            this.isLoading = false;
            if (response.status) {
                this.router.navigate(['/apps/courses/list/view'], {queryParams: {id: this.courseId}});
            } else {
                this.ConfirmColorOpen(response.message, false);
            }
        });
    }

    async updateItem() {
        await this._courseClassListService.updateItem(this.newItemForm.value).then(response => {
            this.isLoading = false;
            if (response.status) {
                this.router.navigate(['/apps/courses/list/view'], {queryParams: {id: this.courseId}});
            } else {
                this.ConfirmColorOpen(response.message, false);
            }
        });
    }

    back() {
        this.router.navigate(['/apps/courses/list/view'], {queryParams: {id: this.courseId}});
    }
    
}