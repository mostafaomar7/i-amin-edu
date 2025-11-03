// financial-report.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { FinancialReportService } from './financial-report.service';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent implements OnInit {
  currencies = [
    { label: '🇪🇬 مصر', value: 'EGP' },
    { label: '🇸🇦 السعودية', value: 'SAR' }
  ];

  selectedCurrency = 'EGP';
  financialData: any;
  public rows = [];
  public tempData = [];
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public isLoading = true;

  // 🆕 متغيرات الفلاتر الجديدة
  public selectedUserType: string = '';
  public selectedStatus: string = '';
public selectedDateFilter: string = '';
public customDate: string = ''; // YYYY-MM-DD

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private financialService: FinancialReportService) {}

  ngOnInit(): void {
    this.loadData();
    this.loadTransactions();
  }

  loadData() {
    this.isLoading = true;
    this.financialService.getFinancialSummary(this.selectedCurrency).subscribe({
      next: (res) => {
        if (res.status) {
          this.financialData = res.innerData;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadTransactions() {
    this.financialService.getAllTransactions(1, 1000).subscribe({
      next: (res) => {
        if (res.status) {
          this.rows = res.innerData.transactions;
          this.tempData = this.rows;
          console.log('Transactions loaded:', this.rows.length);
        }
      },
      error: () => {}
    });
  }

  // ✅ فلترة موحدة تشمل البحث + نوع المستخدم + الحالة
applyFilters() {
  const searchTerm = (this.searchValue || '').toLowerCase().trim();
  const now = new Date();

  this.rows = this.tempData.filter((d: any) => {
    const fullName = `${d.user?.firstName || ''} ${d.user?.lastName || ''}`.toLowerCase();
    const email = (d.user?.email || '').toLowerCase();
    const currency = (d.currency || '').toLowerCase();
    const amountStr = d.amount?.toString().toLowerCase() || '';
    const userType = d.user?.userType?.toString() || '';
    const createdAt = d.createdAt ? new Date(d.createdAt) : null;

    // 🔎 البحث العام
    const matchesSearch =
      !searchTerm ||
      fullName.includes(searchTerm) ||
      email.includes(searchTerm) ||
      currency.includes(searchTerm) ||
      amountStr.includes(searchTerm);

    // 👤 نوع المستخدم
    const matchesUserType = !this.selectedUserType || userType === this.selectedUserType;

    // 💰 العملة
    const matchesCurrency = !this.selectedCurrency || d.currency === this.selectedCurrency;

    // 🗓️ فلترة التاريخ
    let matchesDate = true;
    if (createdAt && this.selectedDateFilter) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const createdDate = new Date(createdAt);
  createdDate.setHours(0, 0, 0, 0);

  switch (this.selectedDateFilter) {
    case 'today':
      matchesDate = createdDate.getTime() === today.getTime();
      break;

    case 'last7days':
      {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = createdDate >= sevenDaysAgo && createdDate <= today;
      }
      break;

    case 'lastMonth':
      {
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        matchesDate = createdDate >= monthAgo && createdDate <= today;
      }
      break;

    case 'lastYear':
      {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(today.getFullYear() - 1);
        matchesDate = createdDate >= yearAgo && createdDate <= today;
      }
      break;

    case 'custom':
      if (this.customDate) {
        const custom = new Date(this.customDate);
        custom.setHours(0, 0, 0, 0);
        matchesDate = createdDate.getTime() === custom.getTime();
      }
      break;

    default:
      matchesDate = true;
  }
}

    return matchesSearch && matchesUserType && matchesCurrency && matchesDate;
  });

  if (this.table) this.table.offset = 0;
}

  filterUpdate() {
    this.applyFilters();
  }
// 🆕 دالة لتحويل transactionType إلى نص واضح
getTransactionTypeText(type: number): string {
  switch (type) {
    case 13:
      return '(ارسال أرباح)';
    case 14:
    case 15:
      return '(شراءالطالب كورس)';
    case 18:
      return '(شراءالطالب جلسة)';
    case 19:
      return '(أرباح المعلم/المنظمة)';
    case 16:
      return '(نصيب المنصة من الكورس)';
    case 20:
      return '(نصيب المنصة من الجلسة)';
    case 17:
    case 21:
      return '(أرباح الوسيط)';
    case 26:
      return 'General Profit Transaction (عملية أرباح عامة)';
    default:
      return 'غير معروف';
  }
}

  onCurrencyChange(event: any) {
    this.selectedCurrency = event.target.value;
    this.loadData();
  }
}
