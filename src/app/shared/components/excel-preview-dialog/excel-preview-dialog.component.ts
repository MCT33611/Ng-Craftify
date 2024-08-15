import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { MaterialModule } from '../../material/material.module';
@Component({
  selector: 'app-excel-preview-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './excel-preview-dialog.component.html',
  styleUrl: './excel-preview-dialog.component.css'
})
export class ExcelPreviewDialogComponent {
  excelData: string;

  constructor(
    public dialogRef: MatDialogRef<ExcelPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const workbook = XLSX.read(data.wbout, { type: 'array' });
    this.excelData = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  download() {
    this.dialogRef.close('download');
  }
}
