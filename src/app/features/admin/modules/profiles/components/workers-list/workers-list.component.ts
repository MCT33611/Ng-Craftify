import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ColumnConfig, ColumnType } from '../../../../../../shared/components/ui-datatable/column-config.model';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../../../../../services/alert.service';
import { IWorker } from '../../../../../../models/iworker';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css'
})
export class WorkersListComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  alertService = inject(AlertService);
  data: IWorker[] = [];
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

  ngOnInit(): void {
    this.userService.getAllWorkers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.$values)) {
          this.data = res.$values.map((ele: IWorker) => ({
            ...ele,
            ...ele.user,
            details: `../worker-details/${ele.id}`,
            approvalChange: `../approval/${ele.userId}`,
            accessChange: `../access/${ele.id}`
          }));
        } else {
          this.alertService.error('Unexpected response format');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(err.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}