import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { IUser } from '../../../../models/iuser';
import { IApiResponse } from '../../../../models/api-response.models';
import { IRoles } from '../../../../core/constants/roles';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reportData: any = {};
  filterForm: FormGroup;
  userWorkerPieChartData: any[] = [];
  bookingBarChartData: any[] = [];
  userGrowthData: any[] = [];
  users: IUser[] = [];
  constructor(
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadReportData();
    this.loadChartData();
  }

  loadReportData(): void {
    // Load data from ReportService
    this.reportService.getTotalUsers().subscribe(data => this.reportData.totalUsers = data.data);
    this.reportService.getTotalServiceCategories().subscribe(data => this.reportData.totalServices = data.data);
    this.reportService.getTotalRevenueFromBookings().subscribe(data => this.reportData.totalRevenue = data.data);
    // Add more data loading as needed
  }

  loadChartData(): void {
    // Load user and worker distribution data
    this.reportService.getTotalUsers().subscribe(totalUsers => {
      this.reportService.getTotalWorkers().subscribe(totalWorkers => {
        this.userWorkerPieChartData = [
          { name: 'Users', value: totalUsers.data },
          { name: 'Workers', value: totalWorkers.data }
        ];
      });
    });

    // Load booking status data
    this.reportService.getBookingsByStatus().subscribe(bookingStatus => {

      this.bookingBarChartData = Object.entries(bookingStatus.data)
        .filter(d => d[0] != "$id")
        .map(([key, value]) => {
          return {
            name: key,
            value: value
          }
        });
    });

    // Load users and generate growth data
    this.reportService.getAllCustomers().subscribe((users: any) => {
      console.log(users);

      this.users = users['$values'];
      this.generateUserGrowthData();

    });
  }

  generateUserGrowthData(): void {
    const sortedUsers = this.users.sort((a, b) =>
      new Date(a.joinDate!).getTime() - new Date(b.joinDate!).getTime()
    );
    console.log(sortedUsers);

    const growthData: { [key: string]: number } = {};
    let cumulativeUsers = 0;

    sortedUsers.forEach((user: IUser) => {
      if (user.joinDate) {
        const dayMonthYear = new Date(user.joinDate).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' });
        cumulativeUsers++;
        growthData[dayMonthYear] = cumulativeUsers;
      }
    });

    this.userGrowthData = [{
      name: 'User Growth',
      series: Object.entries(growthData).map(([day, count]) => ({
        name: day,
        value: count
      }))
    }];
  }

  resetFilters() {
    this.loadChartData();
    this.loadReportData();
    this.filterForm.reset()
  }

  applyFilter(): void {
    const { startDate, endDate } = this.filterForm.value;
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    // Filter Users
    const filteredUsers = this.users.filter(user => {
      const joinDate = user.joinDate ? new Date(user.joinDate).getTime() : null;
      return (!start || (joinDate && joinDate >= start)) && (!end || (joinDate && joinDate <= end));
    });

    // Recalculate Total Users
    this.reportData.totalUsers = filteredUsers.length;

    // Filter Workers and Recalculate Total Workers
    const filteredWorkers = this.users.filter(user => user.role == IRoles.Role_Worker &&
      (!start || (new Date(user.joinDate!).getTime() >= start)) &&
      (!end || (new Date(user.joinDate!).getTime() <= end))
    );
    this.reportData.totalWorkers = filteredWorkers.length;

    // Update Pie Chart Data
    this.userWorkerPieChartData = [
      { name: 'Users', value: filteredUsers.length },
      { name: 'Workers', value: filteredWorkers.length }
    ];

    // Filter Booking Data and Recalculate Booking Bar Chart
    const filteredBookingData = this.bookingBarChartData.filter(booking => {
      const bookingDate = new Date(booking.date).getTime(); // Assuming `booking` has a `date` field
      return (!start || bookingDate >= start) && (!end || bookingDate <= end);
    });

    // Update Booking Bar Chart Data
    this.bookingBarChartData = Object.entries(filteredBookingData.reduce((acc, curr) => {
      acc[curr.name] = (acc[curr.name] || 0) + curr.value;
      return acc;
    }, {})).map(([name, value]) => ({ name, value }));

    // Update User Growth Data
    this.users = filteredUsers;  // Update the users with the filtered ones
    this.generateUserGrowthData();  // Recalculate growth data based on filtered users

    console.log('Filtered data:', this.reportData);
  }




  downloadPDF(): void {
    const { startDate, endDate } = this.filterForm.value;

    const element = document.getElementById('report-content');

    const heading = document.createElement('h1');
    if(startDate && endDate)
      heading.textContent = `Admin Report (${this.formatDate(startDate)} - ${this.formatDate(endDate)})`;
    else
      heading.textContent = `Admin Report (All Time)`;
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
        windowHeight: 1080 
      }).then(canvas => {
        const imgWidth = 210; 
        const pageHeight = 297; 
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        
        const pdf = new jsPDF('p', 'mm');
        let position = 0;
  
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save('admin-report.pdf');
      });
      element.removeChild(heading);
    }
  }
  private formatDate(dateString : string){
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
}
