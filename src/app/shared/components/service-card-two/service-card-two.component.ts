import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { IWorker } from '../../../models/iworker';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-card-two',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink
  ],
  templateUrl: './service-card-two.component.html',
  styleUrl: './service-card-two.component.css'
})
export class ServiceCardTwoComponent {
  @Input({required:true}) worker! : IWorker;
}
