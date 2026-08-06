import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div [formGroup]="formGroup()" class="code-editor">
      <input
        formControlName="language"
        placeholder="language"
      />
      <textarea
        formControlName="text"
        placeholder="Code..."
        class="code-editor__textarea"
      ></textarea>
    </div>
  `,
  styles: [
    `
      .code-editor {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      input {
        padding: 0.375rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.8125rem;
        width: 8rem;
      }
      .code-editor__textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.8125rem;
        resize: vertical;
        min-height: 4rem;
        box-sizing: border-box;
      }
    `,
  ],
})
export class CodeBlockEditor {
  readonly formGroup = input.required<FormGroup>();
}
