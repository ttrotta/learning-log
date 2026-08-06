import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CodeBlockEditor } from './code-editor';

describe('CodeBlockEditor', () => {
  function setup(language = 'typescript', text = '') {
    const formGroup = new FormGroup({
      id: new FormControl({ value: 'b-c1', disabled: true }),
      type: new FormControl('code', { nonNullable: true }),
      language: new FormControl(language, { nonNullable: true }),
      text: new FormControl(text, { nonNullable: true }),
    });
    const fixture = TestBed.createComponent(CodeBlockEditor);
    fixture.componentRef.setInput('formGroup', formGroup);
    fixture.detectChanges();
    return { fixture, formGroup };
  }

  it('should render language input and monospace textarea', () => {
    const { fixture } = setup();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('input')).toBeTruthy();
    expect(el.querySelector('textarea')).toBeTruthy();
  });

  it('should propagate language and text form control values', () => {
    const { fixture } = setup('css', '.class { }');
    const el = fixture.nativeElement as HTMLElement;

    const langInput = el.querySelector('input') as HTMLInputElement;
    expect(langInput.value).toBe('css');

    const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('.class { }');
  });

  it('should update language form control on input change', () => {
    const { fixture, formGroup } = setup('js', '');
    const langInput = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    langInput.value = 'python';
    langInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formGroup.get('language')?.value).toBe('python');
  });

  it('should update text form control on textarea input', () => {
    const { fixture, formGroup } = setup('java', 'old');
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'new code';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formGroup.get('text')?.value).toBe('new code');
  });
});
