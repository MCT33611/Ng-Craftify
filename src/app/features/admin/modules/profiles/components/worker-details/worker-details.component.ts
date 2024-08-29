import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../../../../../../models/iuser';
import { IWorker } from '../../../../../../models/iworker';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';

interface WorkerDetails extends Omit<IWorker, 'user'>, IUser { }

@Component({
  selector: 'app-worker-details',
  templateUrl: './worker-details.component.html',
  styleUrls: ['worker-details.component.css']
})
export class WorkerDetailsComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  alert = inject(AlertService);
  http = inject(HttpClient);

  workerId: string | null = null;
  dataSource: WorkerDetails | null = null;

  private destroy$ = new Subject<void>();

  labels: Array<keyof WorkerDetails> = [
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

  downloadFile(url: string, fileName: string): void {
    console.log(this.dataSource);

    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `${fileName}-${this.getFileNameFromUrl(url)}`;
      link.click();
      window.URL.revokeObjectURL(downloadURL);
    });
  }

  private getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || 'download.pdf';
  }
}