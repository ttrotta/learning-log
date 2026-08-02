import { Component, input } from '@angular/core';
import type { HeadingBlock } from '../types';

@Component({
  selector: 'app-heading-renderer',
  standalone: true,
  template: `
    @switch (block().level) {
      @case (1) { <h1>{{ block().text }}</h1> }
      @case (2) { <h2>{{ block().text }}</h2> }
      @case (3) { <h3>{{ block().text }}</h3> }
      @case (4) { <h4>{{ block().text }}</h4> }
      @case (5) { <h5>{{ block().text }}</h5> }
      @case (6) { <h6>{{ block().text }}</h6> }
    }
  `,
})
export class HeadingRendererComponent {
  readonly block = input.required<HeadingBlock>();
}
