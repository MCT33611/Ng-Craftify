import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageMedia, MediaType } from '../../../../models/message.model';

@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.css']
})
export class MediaViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public media: MessageMedia) {}

  get isImage(): boolean {
    return this.media.type === MediaType.Image;
  }

  get isVideo(): boolean {
    return this.media.type === MediaType.Video;
  }
}