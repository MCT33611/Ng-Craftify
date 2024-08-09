export class AudioRecordedEvent extends Event {
    constructor(public audioBlob: Blob) {
        super('audioRecorded');
    }
}