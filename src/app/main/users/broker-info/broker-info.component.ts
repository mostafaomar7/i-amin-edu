import { Component, OnInit } from '@angular/core';
import feather from 'feather-icons';
import { environment } from 'environments/environment';
import {
  BrokerinfoService,
  BrokerStatisticsResponse,
  BrokerTeachersResponse,
  BrokerCentersResponse
} from './brokerinfo.service';

@Component({
  selector: 'app-broker-info',
  templateUrl: './broker-info.component.html',
  styleUrls: ['./broker-info.component.scss']
})
export class BrokerInfoComponent implements OnInit {
  statistics: BrokerStatisticsResponse['innerData'] | null = null;
  teachers: any[] = [];
  centers: any[] = [];

  constructor(private brokerInfoService: BrokerinfoService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadTeachers();
    this.loadCenters();
  }

  private brokerId = 2025;

  loadStatistics(): void {
    this.brokerInfoService.getBrokerStatistics(this.brokerId).subscribe({
      next: (res) => {
        if (res.status && res.innerData) this.statistics = res.innerData;
        feather.replace();
      },
      error: (err) => console.error('Error loading broker statistics:', err)
    });
  }

  loadTeachers(): void {
  this.brokerInfoService.getBrokerTeachers(this.brokerId).subscribe({
    next: (res: BrokerTeachersResponse) => {
      if (res.status && res.data) {
        this.teachers = res.data.map((t) => ({
          // الاسم الكامل
          name: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim(),

          // البريد الإلكتروني
          email: t.user?.email || '',

          // رقم الهاتف
          phone: t.user?.phone || '—',

          // العمولة
          commission: t.commission ?? 0,

          // الحالة
          documentsCompleted: t.documentsCompleted,
          canGoLive: t.canGoLive,

          // تاريخ التسجيل
          createdAt: t.createdAt,

          // الصورة (لو بتستخدمها)
          image: t.user?.image
            ? `${environment.apiUrl}/uploads/${t.user.image}`
            : 'assets/images/placeholder.png'
        }));
      }
    },
    error: (err) => console.error('Error loading teachers:', err)
  });
}

  loadCenters(): void {
    this.brokerInfoService.getBrokerCenters(this.brokerId).subscribe({
      next: (res: BrokerCentersResponse) => {
        if (res.status && res.data) {
          this.centers = res.data.map((c) => ({
            name: c.name,
            email: c.user.email,
            phone: c.user.phone,
            commission: c.commission,
            isActive: c.isActive ? 'نشط' : 'غير نشط'
          }));
        }
      },
      error: (err) => console.error('Error loading centers:', err)
    });
  }
}
