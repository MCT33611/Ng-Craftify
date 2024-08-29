import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ColumnConfig, ColumnType } from '../../../../../../shared/components/ui-datatable/column-config.model';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../../../../../services/alert.service';
import { IWorker } from '../../../../../../models/iworker';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../../../../../services/loading.service';

interface WorkerResponse {
  $values: IWorker[];
}

interface WorkerListType extends IWorker {
  details: string;
  approvalChange: string;
  accessChange: string;
}

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css'
})
export class WorkersListComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  data: WorkerListType[] = [];
  columns: ColumnConfig[] = [
    { key: 'profilePicture', type: ColumnType.Image, header: 'Profile' },
    { key: 'email', type: ColumnType.Text, header: 'Email' },
    { key: 'approved', type: ColumnType.Text, header: 'Access' },
    { key: 'approvalChange', type: ColumnType.Action, header: 'Approval' },
    { key: 'blocked', type: ColumnType.Text, header: 'Access' },
    { key: 'accessChange', type: ColumnType.Action, header: 'Change' },
    { key: 'details', type: ColumnType.Action, header: 'Details' }
  ];

  private destroy$ = new Subject<void>();

  constructor() {
    this.loadingService.hide();
  }

  ngOnInit(): void {
    this.fetchWorkers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchWorkers(): void {
    this.userService.getAllWorkers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: WorkerResponse) => {
        if (res && Array.isArray(res.$values)) {
          this.data = res.$values.map((ele: IWorker) => this.mapWorkerData(ele));
        } else {
          this.alertService.error('Unexpected response format');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(err.message);
      }
    });
  }

  private mapWorkerData(worker: IWorker): WorkerListType {
    return {
      ...worker,
      ...worker.user,
      details: `../worker-details/${worker.id}`,
      approvalChange: `../approval/${worker.userId}`,
      accessChange: `../access/${worker.userId}`
    };
  }
}