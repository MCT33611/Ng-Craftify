import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { WorkerStore } from '../../../../shared/store/worker.store';
import { WorkerService } from '../../services/worker.service';
import { IWorker } from '../../../../models/iworker';
import { AlertService } from '../../../../services/alert.service';
import { EditServiceModalComponent } from '../edit-service-modal/edit-service-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image-management',
  templateUrl: './image-management.component.html',
  styleUrls: ['./image-management.component.css']
})
export class ImageManagementComponent implements OnInit, OnDestroy {
  private alert = inject(AlertService);
  workerStore = inject(WorkerStore);
  private workerService = inject(WorkerService);
  private dialog = inject(MatDialog);
  
  worker: IWorker = {};
  private subscriptions: Subscription = new Subscription();
  
  ngOnInit() {
    this.workerStore.loadAll();
  }

  addCardImage(workerStore?: IWorker, workerDetails?: IWorker): IWorker {
    return {
      ...workerStore,
      smallPreviewImageUrl: workerDetails?.smallPreviewImageUrl || workerStore?.smallPreviewImageUrl || 'https://www.freeiconspng.com/thumbs/upload-icon/upload-icon-25.png'
    };
  }

  fileUploadSuccessHandler(url: string, type: 'logo' | 'smallPreview' | 'mediumPreview' | 'largePreview') {
    switch (type) {
      case 'logo':
        this.worker.logoUrl = url;
        break;
      case 'smallPreview':
        this.worker.smallPreviewImageUrl = url;
        break;
      case 'mediumPreview':
        this.worker.mediumPreviewImageUrl = url;
        break;
      case 'largePreview':
        this.worker.largePreviewImageUrl = url;
        break;
    }
  }

  save() {
    this.subscriptions.add(
      this.workerService.update(this.worker).subscribe({
        complete: () => {
          this.alert.success("All images are saved successfully");
          this.worker = {};
          this.workerStore.loadAll();
        },
        error: (error) => {
          this.alert.error("Failed to save images. Please try again.");
          console.error('Error saving worker data:', error);
        }
      })
    );
  }

  openEditModal() {
    const dialogRef = this.dialog.open(EditServiceModalComponent, {
      width: '500px',
      data: this.worker
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.worker = { ...this.worker, ...result };
          this.save();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    
    if (Object.keys(this.worker).length > 0) {
      if (confirm("Do you want to save changes before leaving?")) {
        this.save();
      }
    }
  }
}