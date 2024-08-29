import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../services/alert.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { IUser } from '../../../../../../models/iuser';
import { EmailDialogComponent } from '../../../../../../shared/components/email-dialog/email-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-access',
  template: ''
})
export class AccessComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private userId!: string;
  user?: IUser;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadUserAndConfirmAccess();
  }
  
  async loadUserAndConfirmAccess(): Promise<void> {
    this._route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(async params => {
      this.userId = params.get('id')!;
      if (this.userId) {
        try {
          this.user = await firstValueFrom(this._userService.get(this.userId));
        } catch (err: unknown) {
          const error = err as Error;
          this._alertService.error(error.message);
          this._router.navigate(['../']);
          return;
        }
        if (this.user && this.user.email) {
          const confirmation = await this._alertService.confirm("user access change", "Are you sure you want to change access of this user?");
          if (confirmation) {
            this.openEmailDialog(this.user.email);
          } else {
            this._alertService.error("Confirmation denied");
            this._router.navigate(['/admin/profiles']);
          }
        } else {
          this._alertService.error("User email not found");
        }
      }
    });
  }
  
  openEmailDialog(email: string): void {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      data: { email: email }
    });
  
    dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if (result) {
          this._alertService.success('Email sent successfully');
          if (this.userId) {
            this.accessChange(this.userId);
            setTimeout(() => this._router.navigate(['/admin/profiles']), 3000);
          }
        } else {
          this._alertService.error('Email sending cancelled');
          setTimeout(() => this._router.navigate(['/admin/profiles']), 3000);
        }
      }
    });
  }

  accessChange(userId: string): void {
    this._userService.AccessChange(userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      complete: () => {
        this._alertService.success("user access changed successfully");
        this._router.navigate(['/admin/profiles']);
      },
      error: (err: HttpErrorResponse) => {
        this._alertService.error(err.error?.title || 'An error occurred while changing user access');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}