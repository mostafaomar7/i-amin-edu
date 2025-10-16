import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationListService } from '../organization-list.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-organization-preview',
  templateUrl: './organization-preview.component.html',
  styleUrls: ['./organization-preview.service.scss']
})
export class OrganizationPreviewComponent implements OnInit, OnDestroy {

  public isLoading = false;
  centerId: string = "0";
  payouts: any[] = [];
  showRequestInput = false;
  withdrawAmount: number | null = null;
  public courses: any[] = [];
public sessions: any[] = [];
public instructors: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _organizationListService: OrganizationListService,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.getItem(itemId);
    }
  }

  async getItem(id: string) {
  await this._organizationListService.getItem(id).then((response: any) => {
    this.centerId = response.innerData.userId;
    this.loadPayouts();
    this.loadCourses();
    this.loadSessions();
    this.loadInstructors();
    this.cdr.detectChanges();
  });
}


  toggleRequestInput(): void {
    this.showRequestInput = !this.showRequestInput;
  }

  loadPayouts(): void {
    this._organizationListService.getOrganizationPayouts(+this.centerId).then((res: any) => {
      if (res.status && res.innerData?.requests) {
        this.payouts = res.innerData.requests.map((r: any) => ({
          id: r.id,
          amount: r.amount,
          status: this.mapStatus(r.transactionStatus),
          date: r.createdAt,
          bankAccountNumber: r.bankAccountNumber,
          bankAccountName: r.bankAccountName,
          bankName: r.bankName
        }));
      }
    });
  }

  mapStatus(status: any): string {
    const s = Number(status);
    switch (s) {
      case 1:
        return 'Pending';
      case 2:
        return 'Approved';
      default:
        return 'Rejected';
    }
  }

  submitWithdrawRequest(): void {
    if (!this.withdrawAmount || this.withdrawAmount <= 0) {
      Swal.fire('Error', 'Invalid amount!', 'error');
      return;
    }

    const body = {
      receiverId: +this.centerId,
      amount: this.withdrawAmount
    };

    this._organizationListService.createWithdrawRequest(body).then((res: any) => {
      if (res.status) {
        Swal.fire('Success', 'Withdraw request submitted successfully!', 'success');
        this.showRequestInput = false;
        this.withdrawAmount = null;
        this.loadPayouts();
      } else {
        Swal.fire('Error', res.message || 'Something went wrong!', 'error');
      }
    }).catch((err: any) => {
  console.error('Withdraw request error:', err);
  const errorMsg =
    err?.error?.message ||
    err?.message ||
    'Failed to submit request!';

  Swal.fire('Error', errorMsg, 'error');
});

  }

  activateWithdraw(row: any): void {
  Swal.fire({
    title: 'Approve this request?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve it!',
    cancelButtonText: 'Cancel'
  }).then(result => {
    if (result.isConfirmed) {
      this._organizationListService.processWithdrawRequest(row.id)
        .then((res: any) => {
          if (res.status) {
            Swal.fire('Approved!', 'Request approved successfully.', 'success');
            this.loadPayouts();
          } else {
            Swal.fire('Error', res.message || 'Failed to approve request.', 'error');
          }
        })
        .catch((err: any) => {
          console.error('processWithdrawRequest error:', err);
          const msg =
            err?.error?.message ||
            err?.message ||
            'An unexpected error occurred.';
          Swal.fire('Error', msg, 'error');
        });
    }
  });
}


  confirmDelete(row: any): void {
    Swal.fire({
      title: 'Delete this payout request?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this._organizationListService.deleteOrganizationPayout(row.id).then((res: any) => {
          if (res.status) {
            Swal.fire('Deleted!', 'Payout request deleted successfully.', 'success');
            this.loadPayouts();
          } else {
            Swal.fire('Error', res.message || 'Failed to delete payout request.', 'error');
          }
        });
      }
    });
  }
loadCourses(): void {
  this.isLoading = true;
  this._organizationListService.getOrganizationCourses(+this.centerId).then((res: any) => {
    this.isLoading = false;
    if (res.status && res.innerData?.courseTransactions) {
      this.courses = res.innerData.courseTransactions.map((item: any) => ({
        id: item.id,
        amount: item.amount,
        currency: item.currency,
        date: item.createdAt,
        studentName: `${item.studentcourse?.student?.user?.firstName || ''} ${item.studentcourse?.student?.user?.lastName || ''}`,
        courseName: item.studentcourse?.course?.nameEn 
      }));
    }
  });
}

loadSessions(): void {
  this.isLoading = true;
  this._organizationListService.getOrganizationSessions(+this.centerId).then((res: any) => {
    this.isLoading = false;
    if (res.status && res.innerData?.sessionTransactions) {
      this.sessions = res.innerData.sessionTransactions.map((item: any) => ({
        id: item.id,
        amount: item.amount,
        currency: item.currency,
        date: item.createdAt,
        sessionTitle: item.livesession?.title,
        studentName: `${item.livesession?.student?.user?.firstName || ''} ${item.livesession?.student?.user?.lastName || ''}`,
        teacherName: item.livesession?.teacher?.id || ''
      }));
    }
  });
}

loadInstructors(): void {
  this.isLoading = true;
  this._organizationListService.getOrganizationInstructors(+this.centerId).then((res: any) => {
    this.isLoading = false;
    if (res.status && res.innerData?.length) {
      this.instructors = res.innerData.map((t: any) => ({
        id: t.id,
        image: t.user?.image || '',
        name: `${t.user?.firstName} ${t.user?.lastName}`,
        subject: t.subject?.nameEn || '',
        phone: t.user?.phone || ''
      }));
    }
  });
}


  ngOnDestroy(): void {}
}
