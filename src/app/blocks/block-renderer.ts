import { Component, input } from '@angular/core';
import type { Block } from './types';
import { HeadingRendererComponent } from './renderers/heading-renderer';
import { ParagraphRendererComponent } from './renderers/paragraph-renderer';
import { CodeRendererComponent } from './renderers/code-renderer';
import { ImageRendererComponent } from './renderers/image-renderer';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [
    HeadingRendererComponent,
    ParagraphRendererComponent,
    CodeRendererComponent,
    ImageRendererComponent,
  ],
  templateUrl: './block-renderer.html',
  styleUrl: './block-renderer.css',
})
export class BlockRendererComponent {
  readonly blocks = input.required<Block[]>();
}
