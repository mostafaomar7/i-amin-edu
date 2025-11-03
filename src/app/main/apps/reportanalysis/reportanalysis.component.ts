import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  ReportanalysisServService,
  ApiResponse,
  ApiPieChartData,
  ApiBarChartData
} from './reportanalysis-serv.service';

declare var google: any;

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-reportanalysis',
  templateUrl: './reportanalysis.component.html',
  styleUrls: ['./reportanalysis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportanalysisComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartDiv') pieChartDiv!: ElementRef;
  @ViewChild('barChartDiv') barChartDiv!: ElementRef;

  loading: boolean = true;
  error: string | null = null;
  pieChartData: ChartData[] = [];
  barChartData: ChartData[] = [];
  googleChartsLoaded: boolean = false;

  constructor(
    private reportService: ReportanalysisServService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadGoogleChartsScript();
    this.fetchReportData();
  }

  ngAfterViewInit(): void {
    if (this.googleChartsLoaded && this.pieChartData.length > 0) {
      this.drawCharts();
    }
  }

  private loadGoogleChartsScript(): void {
    if (typeof google !== 'undefined' && google.charts) {
      this.googleChartsLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => {
        this.googleChartsLoaded = true;
        if (this.pieChartData.length > 0 || this.barChartData.length > 0) {
          this.drawCharts();
        }
      });
    };
    document.body.appendChild(script);
  }

  private fetchReportData(): void {
    this.loading = true;
    this.error = null;

    this.reportService.getReportAnalysis().subscribe({
      next: (response) => {
        console.log('✅ API Response:', response);

        if (!response.status || !response.innerData) {
          throw new Error('فشل جلب البيانات من الـ API');
        }

        this.transformAndSetData(response.innerData);
        this.loading = false;
        this.cdr.detectChanges(); // ✅ ضروري لتحديث الواجهة بعد تغيير القيم

        // بعد تحميل Google Charts نرسم المخططات
        if (this.googleChartsLoaded) {
          this.drawCharts();
        }
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.error = 'حدث خطأ أثناء جلب البيانات. الرجاء المحاولة لاحقاً.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private transformAndSetData(data: { pieChart: ApiPieChartData; barChart: ApiBarChartData }): void {
    this.pieChartData = [
      { name: 'Revenue', value: data.pieChart.totalRevenue },
      { name: 'Payouts', value: data.pieChart.totalPayouts }
    ];

    this.barChartData = [
      { name: 'Students', value: data.barChart.students },
      { name: 'Instructors', value: data.barChart.instructors },
      { name: 'Organizations', value: data.barChart.organizations },
      { name: 'Brokers', value: data.barChart.brokers },
      { name: 'Courses', value: data.barChart.courses },
      { name: 'Consultations', value: data.barChart.consultations }
    ];
  }

  private drawCharts(): void {
    if (!this.pieChartDiv || !this.barChartDiv) return;

    // Pie Chart
    const pieData = google.visualization.arrayToDataTable([
      ['Type', 'Amount'],
      ...this.pieChartData.map((item) => [item.name, item.value])
    ]);

    const pieOptions = {
      title: 'Revenue vs Payouts Distribution',
      colors: ['#4CAF50', '#F44336'],
      backgroundColor: 'transparent',
      legend: { position: 'bottom' },
      titleTextStyle: { color: '#333', fontSize: 18 }
    };

    const pieChart = new google.visualization.PieChart(this.pieChartDiv.nativeElement);
    pieChart.draw(pieData, pieOptions);

    // Bar Chart
    const barData = google.visualization.arrayToDataTable([
      ['Entity', 'Count', { role: 'style' }],
      ...this.barChartData.map((item) => [item.name, item.value, '#2196F3'])
    ]);

    const barOptions = {
      title: 'System Entity Overview',
      backgroundColor: 'transparent',
      legend: { position: 'none' },
      hAxis: { title: 'Entities', slantedText: true, slantedTextAngle: 45 },
      vAxis: { title: 'Count', minValue: 0 },
      titleTextStyle: { color: '#333', fontSize: 18 }
    };

    const barChart = new google.visualization.ColumnChart(this.barChartDiv.nativeElement);
    barChart.draw(barData, barOptions);
  }
}
