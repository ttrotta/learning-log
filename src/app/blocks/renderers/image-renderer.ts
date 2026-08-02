import { Component, input } from '@angular/core';
import type { ImageBlock } from '../types';

@Component({
  selector: 'app-image-renderer',
  standalone: true,
  template: `
    <figure>
      <img [src]="block().src" [alt]="block().alt" />
      @if (block().caption; as caption) {
        <figcaption>{{ caption }}</figcaption>
      }
    </figure>
  `,
})
export class ImageRendererComponent {
  readonly block = input.required<ImageBlock>();
}
