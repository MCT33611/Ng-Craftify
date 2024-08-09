import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../../../../../../models/iuser';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  alert = inject(AlertService);
  userId!: string | null;
  dataSource!: IUser;

  private destroy$ = new Subject<void>();

  labels: string[] = [
    'profilePicture',
    'firstName',
    'lastName',
    'email',
    'emailConfirmed',
    'streetAddress',
    'city',
    'state',
    'postalCode',
    'role',
  ];

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.userService.get(this.userId).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: IUser) => {
            this.dataSource = res;
          },
          error: (error: HttpErrorResponse) => this.alert.error(JSON.stringify(error.status))
        });
      } else {
        this.alert.error("userId is not valid , Id : " + this.userId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}