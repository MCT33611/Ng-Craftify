import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../../../../../../models/iuser';
import { IWorker } from '../../../../../../models/iworker';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-worker-details',
  templateUrl: './worker-details.component.html',
  styleUrls: ['worker-details.component.css']
})
export class WorkerDetailsComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  alert = inject(AlertService);
  workerId!: string | null;
  dataSource!: IWorker;

  private destroy$ = new Subject<void>();

  labels: string[] = [
    "firstName",
    "lastName",
    "email",
    "profilePicture",
    "serviceTitle",
    "logoUrl",
    "description",
    "skills",
    "hireDate",
    "perHourPrice",
    "approved",
  ];

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.workerId = params.get('id');
      if (this.workerId) {
        this.userService.getWorker(this.workerId).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: IWorker) => {
            this.dataSource = {
              ...res,
              ...res.user,
            };
            // Remove the user property to avoid duplication
            delete this.dataSource.user;
          },
          error: (error: HttpErrorResponse) => this.alert.error(`Error: ${error.status} - ${error.statusText}`)
        });
      } else {
        this.alert.error(`WorkerId is not valid. Id: ${this.workerId}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}