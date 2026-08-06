import { Component, output } from '@angular/core';
import type { BlockType } from '../blocks/types';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  template: `
    <div class="toolbar">
      <button class="toolbar__btn" (click)="addBlock('heading')">
        + Heading
      </button>
      <button class="toolbar__btn" (click)="addBlock('paragraph')">
        + Paragraph
      </button>
      <button class="toolbar__btn" (click)="addBlock('code')">
        + Code
      </button>
      <button class="toolbar__btn" (click)="addBlock('image')">
        + Image
      </button>
    </div>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        padding: 0.5rem 0;
      }
      .toolbar__btn {
        padding: 0.375rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        background: #f9fafb;
        font-size: 0.8125rem;
        cursor: pointer;
        transition: background 0.15s;
      }
      .toolbar__btn:hover {
        background: #e5e7eb;
      }
    `,
  ],
})
export class ToolbarComponent {
  readonly add = output<BlockType>();

  protected addBlock(type: BlockType): void {
    this.add.emit(type);
  }
}
