import { Component, OnInit, OnDestroy } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { IUser } from '../../../../models/iuser';
import { IApiResponse } from '../../../../models/api-response.models';
import { IRoles } from '../../../../core/constants/roles';
import { Subscription } from 'rxjs';

interface ChartData {
  name: string;
  value: number;
}

interface UserGrowthData {
  name: string;
  series: { name: string; value: number }[];
}

interface ReportData {
  totalUsers?: number;
  totalServices?: number;
  totalRevenue?: number;
  totalWorkers?: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit, OnDestroy {
  reportData: ReportData = {};
  filterForm: FormGroup;
  userWorkerPieChartData: ChartData[] = [];
  bookingBarChartData: ChartData[] = [];
  userGrowthData: UserGrowthData[] = [];
  users: IUser[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(private reportService: ReportService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.loadReportData();
    this.loadChartData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadReportData(): void {
    this.subscriptions.add(
      this.reportService
        .getTotalUsers()
        .subscribe((data) => (this.reportData.totalUsers = data.data))
    );
    this.subscriptions.add(
      this.reportService
        .getTotalServiceCategories()
        .subscribe((data) => (this.reportData.totalServices = data.data))
    );
    this.subscriptions.add(
      this.reportService
        .getTotalRevenueFromBookings()
        .subscribe((data) => (this.reportData.totalRevenue = data.data))
    );
  }

  loadChartData(): void {
    this.subscriptions.add(
      this.reportService.getTotalUsers().subscribe((totalUsers) => {
        this.subscriptions.add(
          this.reportService.getTotalWorkers().subscribe((totalWorkers) => {
            this.userWorkerPieChartData = [
              { name: 'Users', value: totalUsers.data },
              { name: 'Workers', value: totalWorkers.data },
            ];
          })
        );
      })
    );

    this.subscriptions.add(
      this.reportService.getBookingsByStatus().subscribe((bookingStatus) => {
        this.bookingBarChartData = Object.entries(bookingStatus.data)
          .filter((d) => d[0] !== '$id')
          .map(([key, value]) => ({
            name: key,
            value: value as number,
          }));
      })
    );

    this.subscriptions.add(
      this.reportService
        .getAllCustomers()
        .subscribe((users: IApiResponse<IUser>) => {
          console.log(users);
          this.users = users.$values;
          this.generateUserGrowthData();
        })
    );
  }

  generateUserGrowthData(): void {
    const sortedUsers = this.users.sort(
      (a, b) =>
        new Date(a.joinDate!).getTime() - new Date(b.joinDate!).getTime()
    );
    console.log(sortedUsers);

    const growthData: { [key: string]: number } = {};
    let cumulativeUsers = 0;

    sortedUsers.forEach((user: IUser) => {
      if (user.joinDate) {
        const dayMonthYear = new Date(user.joinDate).toLocaleDateString(
          'default',
          { day: '2-digit', month: 'short', year: 'numeric' }
        );
        cumulativeUsers++;
        growthData[dayMonthYear] = cumulativeUsers;
      }
    });

    this.userGrowthData = [
      {
        name: 'User Growth',
        series: Object.entries(growthData).map(([day, count]) => ({
          name: day,
          value: count,
        })),
      },
    ];
  }

  resetFilters() {
    this.loadChartData();
    this.loadReportData();
    this.filterForm.reset();
  }

  applyFilter(): void {
    const { startDate, endDate } = this.filterForm.value;
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    const filteredUsers = this.users.filter((user) => {
      const joinDate = user.joinDate ? new Date(user.joinDate).getTime() : null;
      return (
        (!start || (joinDate && joinDate >= start)) &&
        (!end || (joinDate && joinDate <= end))
      );
    });

    this.reportData.totalUsers = filteredUsers.length;

    const filteredWorkers = this.users.filter(
      (user) =>
        user.role === IRoles.Role_Worker &&
        (!start || new Date(user.joinDate!).getTime() >= start) &&
        (!end || new Date(user.joinDate!).getTime() <= end)
    );
    this.reportData.totalWorkers = filteredWorkers.length;

    this.userWorkerPieChartData = [
      { name: 'Users', value: filteredUsers.length },
      { name: 'Workers', value: filteredWorkers.length },
    ];

    const filteredBookingData = this.bookingBarChartData.filter((booking) => {
      const bookingDate = new Date(booking.name).getTime();
      return (!start || bookingDate >= start) && (!end || bookingDate <= end);
    });

    this.bookingBarChartData = Object.entries(
      filteredBookingData.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.name] = (acc[curr.name] || 0) + curr.value;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    this.users = filteredUsers;
    this.generateUserGrowthData();

    console.log('Filtered data:', this.reportData);
  }

  downloadPDF(): void {
    const { startDate, endDate } = this.filterForm.value;

    const element = document.getElementById('report-content');

    const heading = document.createElement('h1');
    if (startDate && endDate)
      heading.textContent = `Admin Report (${this.formatDate(
        startDate
      )} - ${this.formatDate(endDate)})`;
    else heading.textContent = `Admin Report (All Time)`;
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '10px';
    heading.style.fontSize = '24px';
    if (element) {
      element.insertBefore(heading, element.firstChild);
      html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        windowWidth: 1920,
        windowHeight: 1080,
      }).then((canvas) => {
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF('p', 'mm');
        let position = 0;

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            position,
            imgWidth,
            imgHeight
          );
          heightLeft -= pageHeight;
        }

        pdf.save('admin-report.pdf');
      });
      element.removeChild(heading);
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
