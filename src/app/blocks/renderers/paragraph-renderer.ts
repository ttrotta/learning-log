import { Component, input } from '@angular/core';
import type { ParagraphBlock } from '../types';

@Component({
  selector: 'app-paragraph-renderer',
  standalone: true,
  template: ` <p>{{ block().text }}</p> `,
})
export class ParagraphRendererComponent {
  readonly block = input.required<ParagraphBlock>();
}
