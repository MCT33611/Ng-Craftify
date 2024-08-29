import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LoadingComponent } from '../shared/components/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new Subject<boolean>();
  private dialogRef!: MatDialogRef<LoadingComponent>;

  constructor(private dialog: MatDialog) {
    this.loadingSubject.subscribe((isLoading) => {
      if (isLoading) {
        this.dialogRef = this.dialog.open(LoadingComponent, {
          disableClose: true,
          panelClass: 'transparent-dialog',
        });
      } else if (this.dialogRef) {
        this.dialogRef.close();
      }
    });
  }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
