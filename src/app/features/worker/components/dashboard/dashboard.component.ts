import { Component, computed, inject } from '@angular/core';
import { CustomersListStore } from '../../../../shared/store/customers-list.store';
import { WorkersListStore } from '../../../../shared/store/workers-list.store';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  customersStore = inject(CustomersListStore);
  workersStore = inject(WorkersListStore);
  constructor(){
    this.customersStore.loadAll();
    this.workersStore.loadAll();
  }
  approvedWorkers = computed(() => 
    this.workersStore.workers()?.filter(worker => worker.approved) ?? []
  );
}