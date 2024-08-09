import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-completion-dialog',
  templateUrl: './task-completion-dialog.component.html',
  styleUrl: './task-completion-dialog.component.css'
})
export class TaskCompletionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TaskCompletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}

  onOtpVerified() {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
