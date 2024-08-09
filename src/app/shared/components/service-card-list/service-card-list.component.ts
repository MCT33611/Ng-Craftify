import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { IWorker } from '../../../models/iworker';

@Component({
  selector: 'app-service-card-list',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './service-card-list.component.html',
  styleUrl: './service-card-list.component.css'
})
export class ServiceCardListComponent {
  @Input() workers!: IWorker[];
}
