import { Component, ElementRef, afterNextRender, input, viewChild } from '@angular/core';
import type { CodeBlock } from '../types';

@Component({
  selector: 'app-code-renderer',
  standalone: true,
  template: `
    <pre><code #codeEl [class]="'hljs language-' + block().language">{{ block().text }}</code></pre>
  `,
})
export class CodeRendererComponent {
  readonly block = input.required<CodeBlock>();
  private readonly codeEl = viewChild<ElementRef<HTMLElement>>('codeEl');

  constructor() {
    afterNextRender(() => {
      const el = this.codeEl()?.nativeElement;
      if (el) {
        import('highlight.js').then((hljs) => {
          hljs.default.highlightElement(el);
        });
      }
    });
  }
}
