import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrl: './audio-recorder.component.css'
})
export class AudioRecorderComponent {
  @Output() audioRecorded = new EventEmitter<Blob>();

  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  isRecording = false;

  constructor(private audioContext: AudioContext) {}

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
      this.audioRecorded.emit(audioBlob);
      this.chunks = [];
    };

    this.mediaRecorder.start();
    this.isRecording = true;
  }

  private stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
}
