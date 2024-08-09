import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IWorker } from '../../../models/iworker';
import { ImageSliderComponent } from '../image-slider/image-slider';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, ImageSliderComponent],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  @Input() worker!: IWorker;
  @Input() size: "small" | "large" = 'large';
  @Output() bookNow = new EventEmitter<void>();
  @Output() showDetails = new EventEmitter<void>();

  getFirstTwoSkills(): string[] {
    return (this.worker.skills?.split(',') || []).slice(0, 2).map(skill => skill.trim());
  }
}