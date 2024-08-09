import { CommonModule, UpperCasePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core';
import * as LR from "@uploadcare/blocks";
import { OutputFileEntry } from '@uploadcare/blocks';
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-ui-upsert-form',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    UpperCasePipe,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './ui-upsert-form.component.html',
  styleUrls: ['./ui-upsert-form.component.css']
})
export class UiUpsertFormComponent implements  OnChanges {
  @Input() isDetails!: boolean;
  @Input() showUploader: boolean = true;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) labels!: string[];
  @Input() data!: any;
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;
  files: OutputFileEntry<'success'>[] = [];

  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<InstanceType<LR.UploadCtxProvider>>;

  constructor(private _fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    let controls: any = {};
    this.labels.forEach((label) => {
      controls[label] = new FormControl({ value: this.data ? this.data[label] : "", disabled: this.isDetails }, [Validators.required]);
    });
    this.form = this._fb.group(controls);

    if (this.data?.imageUrls) {
      this.data.imageUrls.forEach((url: string, index: number) => {
        const file: OutputFileEntry<'success'> | any = { cdnUrl: url, uuid: index.toString() };
        this.files.push(file);
      });
    }
    if (!this.isDetails && this.showUploader) {
      LR.registerBlocks(LR);
      this.ctxProviderRef.nativeElement.addEventListener('change', this.handleChangeEvent);
    }
  }



  ngOnDestroy() {
    this.ctxProviderRef.nativeElement.removeEventListener('change', this.handleChangeEvent);
  }

  handleChangeEvent = (e: LR.EventMap['change']) => {
    this.files = e.detail.allEntries.filter(f => f.status === 'success') as OutputFileEntry<'success'>[];
  };

  handleRemoveClick(uuid: OutputFileEntry['uuid']) {
    this.files = this.files.filter(f => f.uuid !== uuid);
  }

  onSubmit() {
    this.formSubmit.emit({ ...this.form.value, imageUrls: this.files.map(file => file.cdnUrl) });
  }
}
