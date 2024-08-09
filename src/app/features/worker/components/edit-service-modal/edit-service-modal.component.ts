import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IWorker } from '../../../../models/iworker';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-edit-service-modal',
  templateUrl: './edit-service-modal.component.html',
  styleUrl: './edit-service-modal.component.css'
})
export class EditServiceModalComponent {
  editForm: FormGroup;
  skills: string[] = [];
  separatorKeysCodes: number[] = [13, 188]; // Enter and comma keys

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditServiceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWorker
  ) {
    this.editForm = this.fb.group({
      serviceTitle: [data.serviceTitle, Validators.required],
      perHourPrice: [data.perHourPrice, [Validators.required, Validators.min(0)]],
      description: [data.description, Validators.required]
    });
    this.skills = data.skills ? data.skills.split(',').map(skill => skill.trim()) : [];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedWorker: IWorker = {
        ...this.data,
        ...this.editForm.value,
        skills: this.skills.join(', ')
      };
      this.dialogRef.close(updatedWorker);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.skills.push(value);
    }
    event.chipInput!.clear();
  }

  remove(skill: string): void {
    const index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }
}
