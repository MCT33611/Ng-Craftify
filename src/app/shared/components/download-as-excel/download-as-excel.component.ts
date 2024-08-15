import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { MaterialModule } from '../../material/material.module';
import { ExcelPreviewDialogComponent } from '../excel-preview-dialog/excel-preview-dialog.component';
import { saveAs } from 'file-saver';
import { AlertService } from '../../../services/alert.service';
@Component({
  selector: 'app-download-as-excel',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './download-as-excel.component.html',
  styleUrl: './download-as-excel.component.css'
})
export class DownloadAsExcelComponent {
  @Input() data: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _alert:AlertService
  ) {}

  exportToExcel() {
    if(this.data.length <= 0){
      this._alert.warning("list is emty");
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    const dialogRef = this.dialog.open(ExcelPreviewDialogComponent, {
      width: '80%',
      data: { blob, wbout }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'download') {
        saveAs(blob, 'data.xlsx');
      }
    });
  }
}
