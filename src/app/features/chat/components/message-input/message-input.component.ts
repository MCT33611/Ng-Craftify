import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css',
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MessageInputComponent {
  @Output() send = new EventEmitter();
  @Output() typing = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;
  content = '';
  fileObjectURLs:string[] = [];
  selectedFiles: File[] = [];
  alert = inject(AlertService);
  showEmojiPicker = false;
  MAX_FILE_SIZE = 10 * 1024 * 1024
  readonly VIDEO_PREVIEW_URL = 'https://as2.ftcdn.net/v2/jpg/01/08/24/99/1000_F_108249941_bTYS1X2YhbvzrFioQlOzIbpVknseimHA.jpg';
  readonly AUDIO_PREVIEW_URL = 'https://cdn4.iconfinder.com/data/icons/audio-and-music-4/32/music-audio-song-square-512.png';
  
  addEmoji(emoji:any){
    
    this.content += emoji.emoji.native;
  }

  onSend(){
    if(this.content!.trim() || this.selectedFiles.length > 0){
      this.send.emit({files:this.selectedFiles,content:this.content});
    }
    this.content='';
    this.clearFiles();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      if (this.selectedFiles.length + files.length > 5) {
        this.alert.warning("Can't attach more than 5 files");
        return;
      }
      // if(!this.selectedFiles.some(f => f.size > this.MAX_FILE_SIZE)){
      //   this.alert.warning("Can't send files larger than 10 MB");
      //   return;
      // }
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const srcURL = URL.createObjectURL(file);
          this.fileObjectURLs.push(srcURL);
        } else if (file.type.startsWith('video/') ) {
          this.fileObjectURLs.push(this.VIDEO_PREVIEW_URL);
        }else if(file.type.startsWith('audio/')){
          this.fileObjectURLs.push(this.AUDIO_PREVIEW_URL);
        }
        this.selectedFiles.push(file);
      });
    }
  }

  onContentChange() {
    this.typing.emit();
  }

  clearFiles() {
    this.fileObjectURLs.forEach(url => URL.revokeObjectURL(url));
    this.fileObjectURLs = [];
    this.selectedFiles = [];
  }

  removeFile(index: number) {
    URL.revokeObjectURL(this.fileObjectURLs[index]);
    this.fileObjectURLs.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  recorderdAudioHandler(audio:Blob){
    const fileList = new DataTransfer();
    fileList.items.add(new File([audio], 'audio.mp3', { type: 'audio/mp3' }));
    this.fileInput.nativeElement.files = fileList.files;

    const event = new Event('change', { bubbles: true });
    this.fileInput.nativeElement.dispatchEvent(event);
  }
}
