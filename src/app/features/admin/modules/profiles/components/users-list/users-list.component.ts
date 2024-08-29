import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../../../../../services/alert.service';
import { ColumnConfig, ColumnType } from '../../../../../../shared/components/ui-datatable/column-config.model';
import { IRoles } from '../../../../../../core/constants/roles';
import { IUser } from '../../../../../../models/iuser';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../../../../../services/loading.service';

interface UserWithActions extends IUser {
  details: string;
  accessChange: string;
}

interface ApiResponse<T> {
  $values: T[];
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  alertService = inject(AlertService);

  data: UserWithActions[] = [];
  columns: ColumnConfig[] = [
    { key: 'profilePicture', type: ColumnType.Image, header: 'Profile' },
    { key: 'firstName', type: ColumnType.Text, header: 'First Name' },
    { key: 'email', type: ColumnType.Text, header: 'Email' },
    { key: 'blocked', type: ColumnType.Text, header: 'Access' },
    { key: 'accessChange', type: ColumnType.Action, header: 'Change' },
    { key: 'details', type: ColumnType.Action, header: 'Details' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private _loading: LoadingService
  ) {
    _loading.hide();
  }

  ngOnInit(): void {
    this.userService.getAllCustomers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: ApiResponse<IUser>) => {
        if (res && res.$values && Array.isArray(res.$values)) {
          this.data = res.$values.map((ele: IUser): UserWithActions => ({
            ...ele,
            details: `../details/${ele.id}`,
            accessChange: `../access/${ele.id}`
          }));
        } else {
          console.error('Unexpected response structure:', res);
          this.alertService.error('Unexpected data structure received from server');
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