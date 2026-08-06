import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ParagraphBlockEditor } from './paragraph-editor';

describe('ParagraphBlockEditor', () => {
  function setup(text = '') {
    const formGroup = new FormGroup({
      id: new FormControl({ value: 'b-p1', disabled: true }),
      type: new FormControl('paragraph', { nonNullable: true }),
      text: new FormControl(text, { nonNullable: true }),
    });
    const fixture = TestBed.createComponent(ParagraphBlockEditor);
    fixture.componentRef.setInput('formGroup', formGroup);
    fixture.detectChanges();
    return { fixture, formGroup };
  }

  it('should render a textarea', () => {
    const { fixture } = setup();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('textarea')).toBeTruthy();
  });

  it('should propagate text form control value to textarea', () => {
    const { fixture } = setup('Hello paragraph');
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.value).toBe('Hello paragraph');
  });

  it('should update form control when user types', () => {
    const { fixture, formGroup } = setup('Initial');
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'Updated text';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formGroup.get('text')?.value).toBe('Updated text');
  });
});
