import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { HeadingBlockEditor } from './heading-editor';

describe('HeadingBlockEditor', () => {
  function setup(level: 1 | 2 | 3 | 4 | 5 | 6 = 2, text = 'Heading text') {
    const formGroup = new FormGroup({
      id: new FormControl({ value: 'b-h1', disabled: true }),
      type: new FormControl('heading', { nonNullable: true }),
      level: new FormControl(level, { nonNullable: true }),
      text: new FormControl(text, { nonNullable: true }),
    });
    const fixture = TestBed.createComponent(HeadingBlockEditor);
    fixture.componentRef.setInput('formGroup', formGroup);
    fixture.detectChanges();
    return { fixture, formGroup };
  }

  it('should render level select and text input', () => {
    const { fixture } = setup();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('select')).toBeTruthy();
    expect(el.querySelector('textarea')).toBeTruthy();
  });

  it('should propagate form control values to the DOM', () => {
    const { fixture } = setup(3, 'Sub heading');
    const el = fixture.nativeElement as HTMLElement;

    // Verify the correct option is selected via its display text
    const select = el.querySelector('select') as HTMLSelectElement;
    expect(select.options[select.selectedIndex].text).toBe('Heading 3');

    const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Sub heading');
  });

  it('should update form control when user changes level', () => {
    const { fixture, formGroup } = setup(1, 'Change me');
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

    // Select the option with ngValue=4 — dispatch change event to trigger Angular
    select.options[3].selected = true;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(formGroup.get('level')?.value).toBe(4);
  });

  it('should update text form control when user types', () => {
    const { fixture, formGroup } = setup(2, '');
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'New text';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formGroup.get('text')?.value).toBe('New text');
  });
});
