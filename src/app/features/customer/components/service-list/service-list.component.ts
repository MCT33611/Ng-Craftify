import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { IWorker } from '../../../../models/iworker';
import { CustomerService } from '../../services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../../../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { IApiResponse } from '../../../../models/api-response.models';
import { IBooking } from '../../../../models/ibooking';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  workers: IWorker[] = [];
  filteredWorkers: IWorker[] = this.workers;
  searchTerm: string = '';
  selectedCategories: string[] = [];
  categories: string[] = [
    'Plumbing',
    'Wiring',
    'Construction',
    'Painting',
    'Landscaping',
    'Cleaning',
    'HVAC',
    'Carpentry',
    'Auto Repair',
    'IT Support',
    'Personal Training',
    'Tutoring',
    'Pet Grooming',
  ];

  customerService = inject(CustomerService);
  _alert = inject(AlertService);
  _route = inject(ActivatedRoute);

  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.loadWorkers();
    this.applyFilters();

    this.subscriptions.add(
      this._route.queryParams.subscribe((queryParam) => {
        const term = queryParam['search'];
        if (term) {
          this.searchTerm = term;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadWorkers() {
    this.subscriptions.add(
      this.customerService.getAllWorkers().subscribe({
        next: (res: IApiResponse<IWorker>) => {
          let workers: IWorker[];

          if (res && Array.isArray(res.$values)) {
            workers = res.$values;
          } else if (Array.isArray(res)) {
            workers = res;
          } else {
            console.error('Unexpected response format:', res);
            this._alert.error('Unexpected data format received');
            workers = [];
          }

          this.workers = workers.filter((w) => w.approved);
          this.applyFilters();
          console.log(this.workers);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error loading workers:', err);
          this._alert.error('Something went wrong');
          this.workers = [];
        },
      })
    );
  }

  applyFilters() {
    this.filteredWorkers = this.workers.filter(
      (worker) =>
        (this.searchTerm === '' ||
          worker.serviceTitle
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase())) &&
        (this.selectedCategories.length === 0 ||
          this.selectedCategories.includes(worker.serviceTitle || ''))
    );
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  }

  loadMore() {
    console.log('Loading more services...');
  }
}
