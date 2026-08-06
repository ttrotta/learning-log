import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-paragraph-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div [formGroup]="formGroup()">
      <textarea
        formControlName="text"
        placeholder="Paragraph text..."
      ></textarea>
    </div>
  `,
  styles: [
    `
      textarea {
        width: 100%;
        padding: 0.375rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.8125rem;
        resize: vertical;
        min-height: 3rem;
        box-sizing: border-box;
      }
    `,
  ],
})
export class ParagraphBlockEditor {
  readonly formGroup = input.required<FormGroup>();
}
