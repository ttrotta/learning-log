import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageBlockEditor } from './image-editor';

describe('ImageBlockEditor', () => {
  function setup(src = '', alt = '', caption: string | null = null) {
    const formGroup = new FormGroup({
      id: new FormControl({ value: 'b-i1', disabled: true }),
      type: new FormControl('image', { nonNullable: true }),
      src: new FormControl(src, { nonNullable: true }),
      alt: new FormControl(alt, { nonNullable: true }),
      caption: new FormControl(caption),
    });
    const fixture = TestBed.createComponent(ImageBlockEditor);
    fixture.componentRef.setInput('formGroup', formGroup);
    fixture.detectChanges();
    return { fixture, formGroup };
  }

  it('should render src, alt, and caption inputs', () => {
    const { fixture } = setup();
    const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll('input');

    expect(inputs.length).toBe(3);
  });

  it('should propagate src, alt, and caption values', () => {
    const { fixture } = setup('/photo.jpg', 'A photo', 'Nice view');
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    expect(inputs[0].value).toBe('/photo.jpg');
    expect(inputs[1].value).toBe('A photo');
    expect(inputs[2].value).toBe('Nice view');
  });

  it('should handle null caption', () => {
    const { fixture } = setup('/img.png', 'No caption', null);
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    expect(inputs[2].value).toBe('');
  });

  it('should update src form control on input', () => {
    const { fixture, formGroup } = setup('', '', null);
    const srcInput = fixture.nativeElement.querySelectorAll('input')[0] as HTMLInputElement;

    srcInput.value = '/new.jpg';
    srcInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formGroup.get('src')?.value).toBe('/new.jpg');
  });

  it('should update alt form control on input', () => {
    const { fixture, formGroup } = setup('/pic.jpg', '', null);
    const altInput = fixture.nativeElement.querySelectorAll('input')[1] as HTMLInputElement;

    altInput.value = 'New alt text';
    altInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formGroup.get('alt')?.value).toBe('New alt text');
  });

  it('should update caption form control on input', () => {
    const { fixture, formGroup } = setup('/pic.jpg', 'Alt', null);
    const captionInput = fixture.nativeElement.querySelectorAll('input')[2] as HTMLInputElement;

    captionInput.value = 'New caption';
    captionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(formGroup.get('caption')?.value).toBe('New caption');
  });
});
