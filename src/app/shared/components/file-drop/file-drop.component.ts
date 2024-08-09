import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-drop',
  standalone: true,
  imports: [
    NgClass,
    CommonModule
  ],
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.css']
})
export class FileDropComponent {

  selectedFileNames: { name: string, size: number }[] = [];
  @Output() fileSelected = new EventEmitter<File[]>();
  openFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  handleFileChange(event: Event): void {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList) {
      const filesArray: File[] = Array.from(fileList);
      this.fileSelected.emit(filesArray);
      for (let i = 0; i < fileList.length; i++) {
        this.selectedFileNames.push({
          name: fileList[i].name,
          size: fileList[i].size
        });
      }
    }
  }

  formatFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
  }

  removeFile(index: number): void {
    this.selectedFileNames.splice(index, 1);
  }
}
