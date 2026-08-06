import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-heading-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div [formGroup]="formGroup()" class="heading-editor">
      <select formControlName="level">
        <option [ngValue]="1">Heading 1</option>
        <option [ngValue]="2">Heading 2</option>
        <option [ngValue]="3">Heading 3</option>
        <option [ngValue]="4">Heading 4</option>
        <option [ngValue]="5">Heading 5</option>
        <option [ngValue]="6">Heading 6</option>
      </select>
      <textarea
        formControlName="text"
        placeholder="Heading text..."
      ></textarea>
    </div>
  `,
  styles: [
    `
      .heading-editor {
        display: flex;
        gap: 0.5rem;
      }
      select {
        width: 8rem;
        padding: 0.375rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.8125rem;
      }
      textarea {
        flex: 1;
        padding: 0.375rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.8125rem;
        resize: vertical;
        min-height: 2.5rem;
      }
    `,
  ],
})
export class HeadingBlockEditor {
  readonly formGroup = input.required<FormGroup>();
}
