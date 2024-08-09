// app-image-slider.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  standalone:true,
  template: `
    <div class="relative w-full h-full overflow-hidden">
      <div class="flex transition-transform duration-300 ease-in-out" [style.transform]="'translateX(' + (-currentIndex * 100) + '%)'">
        @for(image of images; track image.url) {
          <img [src]="image.url" [alt]="image.alt" class="w-full h-full object-cover flex-shrink-0">
        }
      </div>
      <button (click)="prev()" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2">&lt;</button>
      <button (click)="next()" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2">&gt;</button>
    </div>
  `,
})
export class ImageSliderComponent {
  @Input() images: Array<{ url: string, alt: string }> = [];
  currentIndex = 0;

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
}