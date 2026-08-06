import { Component, computed, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HeadingBlockEditor } from './heading-editor';
import { ParagraphBlockEditor } from './paragraph-editor';
import { CodeBlockEditor } from './code-editor';
import { ImageBlockEditor } from './image-editor';
import type { BlockType } from '../blocks/types';

@Component({
  selector: 'app-editor-block',
  standalone: true,
  imports: [
    HeadingBlockEditor,
    ParagraphBlockEditor,
    CodeBlockEditor,
    ImageBlockEditor,
  ],
  template: `
    <div class="editor-block">
      <div class="editor-block__header">
        <span class="editor-block__drag" data-testid="drag-handle">
          ⠿
        </span>
        <span class="editor-block__type">{{ blockType() }}</span>
        <button
          class="editor-block__delete"
          data-testid="delete-block"
          (click)="delete.emit()"
        >
          ✕
        </button>
      </div>

      @switch (blockType()) {
        @case ('heading') {
          <app-heading-editor [formGroup]="formGroup()" />
        }
        @case ('paragraph') {
          <app-paragraph-editor [formGroup]="formGroup()" />
        }
        @case ('code') {
          <app-code-editor [formGroup]="formGroup()" />
        }
        @case ('image') {
          <app-image-editor [formGroup]="formGroup()" />
        }
      }
    </div>
  `,
  styles: [
    `
      .editor-block {
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        background: #fff;
        overflow: hidden;
      }
      .editor-block__header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.5rem;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
      }
      .editor-block__drag {
        cursor: grab;
        color: #9ca3af;
        font-size: 1rem;
        user-select: none;
      }
      .editor-block__drag:active {
        cursor: grabbing;
      }
      .editor-block__type {
        flex: 1;
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .editor-block__delete {
        padding: 0.125rem 0.375rem;
        border: none;
        background: transparent;
        color: #9ca3af;
        cursor: pointer;
        font-size: 0.875rem;
        border-radius: 0.25rem;
      }
      .editor-block__delete:hover {
        background: #fee2e2;
        color: #dc2626;
      }
    `,
  ],
})
export class EditorBlockComponent {
  readonly formGroup = input.required<FormGroup>();
  readonly delete = output<void>();

  protected readonly blockType = computed((): BlockType => {
    return this.formGroup().get('type')?.value as BlockType;
  });
}
