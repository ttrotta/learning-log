import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div [formGroup]="formGroup()" class="image-editor">
      <input
        formControlName="src"
        placeholder="Image URL"
      />
      <input
        formControlName="alt"
        placeholder="Alt text"
      />
      <input
        formControlName="caption"
        placeholder="Caption (optional)"
      />
    </div>
  `,
  styles: [
    `
      .image-editor {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      input {
        padding: 0.375rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.8125rem;
        width: 100%;
        box-sizing: border-box;
      }
    `,
  ],
})
export class ImageBlockEditor {
  readonly formGroup = input.required<FormGroup>();
}
