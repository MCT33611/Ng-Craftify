import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, Input, Output, EventEmitter } from '@angular/core';
import * as LR from "@uploadcare/blocks";
import { OutputFileEntry } from '@uploadcare/blocks';
//import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";
import { ProfileService } from '../../../features/profile/services/profile.service';
import { AlertService } from '../../../services/alert.service';
import { ProfileStore } from '../../store/profile.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [],
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UploaderComponent implements OnInit, OnDestroy {

  @Output() cdnUrl: EventEmitter<string> = new EventEmitter<string>();
  @Input() multiple: boolean = false;
  @Input() ctxName: string = 'my-uploader';
  
  private subscriptions: Subscription = new Subscription();
  profile = inject(ProfileService)
  alert = inject(AlertService)
  profileStore = inject(ProfileStore)

  file: OutputFileEntry<'success'> | null = null;
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<InstanceType<LR.UploadCtxProvider>>;

  ngOnInit(): void {
    LR.registerBlocks(LR);
    this.ctxProviderRef.nativeElement.addEventListener(
      'change',
      this.handleChangeEvent,
    );
  }

  ngOnDestroy() {
    this.ctxProviderRef.nativeElement.removeEventListener(
      'change',
      this.handleChangeEvent,
    );
    this.subscriptions.unsubscribe();
  }

  handleChangeEvent = (e: LR.EventMap['change']) => {
    const successfulEntries = e.detail.allEntries.filter(f => f.status === 'success') as OutputFileEntry<'success'>[];
    this.file = successfulEntries.length > 0 ? successfulEntries[0] : null;
    this.cdnUrl.emit(this.file?.cdnUrl);
  };
}