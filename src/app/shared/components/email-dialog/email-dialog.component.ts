import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmailService } from '../../../services/email.service';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-email-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './email-dialog.component.html',
  styleUrl: './email-dialog.component.css'
})
export class EmailDialogComponent implements OnInit {
  emailForm!: FormGroup;
  selectedTemplate: string = 'text';
  templates = ['text', 'warning', 'info', 'custom'];
  previewHtml: string = '';

  constructor(
    @Optional() private dialogRef: MatDialogRef<EmailDialogComponent>,
    private fb: FormBuilder,
    private emailService: EmailService,
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
  ) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      to: [this.data.email, [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      content: ['', Validators.required],
      customHtml: ['']
    });
    this.emailForm.get('to')?.disable();

    this.emailForm.valueChanges.subscribe(() => this.updatePreview());
  }


  updatePreview() {
    const { subject, content } = this.emailForm.value;
    switch (this.selectedTemplate) {
      case 'text':
        this.previewHtml = `
          <div class="font-sans">
            <h1 class="text-2xl font-bold mb-4">${subject}</h1>
            <p class="text-base">${content}</p>
          </div>
        `;
        break;
      case 'warning':
        this.previewHtml = `
          <div class="bg-yellow-50 border-2 border-yellow-500 p-5 rounded-lg font-sans">
            <h1 class="text-2xl font-bold text-yellow-700 mb-4">${subject}</h1>
            <p class="text-base text-yellow-800">${content}</p>
          </div>
        `;
        break;
      case 'info':
        this.previewHtml = `
          <div class="bg-blue-50 border-2 border-blue-500 p-5 rounded-lg font-sans">
            <h1 class="text-2xl font-bold text-blue-700 mb-4">${subject}</h1>
            <p class="text-base text-blue-800">${content}</p>
          </div>
        `;
        break;
      case 'custom':
        this.previewHtml = `
        <!doctype html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            ${this.emailForm.get('customHtml')!.value}
          </body>
        </html>
        `
        break;
    }
  }

  onSubmit() {
    const { to, subject } = this.emailForm.value;
    this.emailService.sendEmail(this.data.email, subject, this.previewHtml).subscribe({
      next: response => {
        console.log('Email sent successfully', response);
        this.dialogRef.close(true);
      },
      error: error => {
        console.error('Error sending email', error);
      }
    }
    );
  }

  closeDialog(): void {
    this.dialogRef.close(false);

  }
}