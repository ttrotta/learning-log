import { FormGroup } from '@angular/forms';
import { createBlockFormGroup } from './block-form';
import type { HeadingBlock, ParagraphBlock, CodeBlock, ImageBlock } from '../blocks/types';

describe('createBlockFormGroup', () => {
  it('should create a FormGroup for a HeadingBlock with disabled id control', () => {
    const block: HeadingBlock = {
      id: 'b-head-1',
      type: 'heading',
      level: 3,
      text: 'Test Heading',
    };

    const form = createBlockFormGroup(block);

    expect(form).toBeInstanceOf(FormGroup);
    expect(form.get('id')?.disabled).toBe(true);
    expect(form.get('id')?.value).toBe('b-head-1');
    expect(form.get('type')?.value).toBe('heading');
    expect(form.get('level')?.value).toBe(3);
    expect(form.get('text')?.value).toBe('Test Heading');
    expect(form.getRawValue()).toEqual(block);
  });

  it('should create a FormGroup for a ParagraphBlock', () => {
    const block: ParagraphBlock = {
      id: 'b-para-1',
      type: 'paragraph',
      text: 'A short paragraph.',
    };

    const form = createBlockFormGroup(block);

    expect(form).toBeInstanceOf(FormGroup);
    expect(form.get('id')?.disabled).toBe(true);
    expect(form.get('id')?.value).toBe('b-para-1');
    expect(form.get('type')?.value).toBe('paragraph');
    expect(form.get('text')?.value).toBe('A short paragraph.');
    expect(form.getRawValue()).toEqual(block);
  });

  it('should create a FormGroup for a CodeBlock', () => {
    const block: CodeBlock = {
      id: 'b-code-1',
      type: 'code',
      language: 'typescript',
      text: 'console.log("hello");',
    };

    const form = createBlockFormGroup(block);

    expect(form).toBeInstanceOf(FormGroup);
    expect(form.get('id')?.disabled).toBe(true);
    expect(form.get('id')?.value).toBe('b-code-1');
    expect(form.get('type')?.value).toBe('code');
    expect(form.get('language')?.value).toBe('typescript');
    expect(form.get('text')?.value).toBe('console.log("hello");');
    expect(form.getRawValue()).toEqual(block);
  });

  it('should create a FormGroup for an ImageBlock', () => {
    const block: ImageBlock = {
      id: 'b-img-1',
      type: 'image',
      src: '/photo.jpg',
      alt: 'A scenic view',
      caption: 'Beautiful landscape',
    };

    const form = createBlockFormGroup(block);

    expect(form).toBeInstanceOf(FormGroup);
    expect(form.get('id')?.disabled).toBe(true);
    expect(form.get('id')?.value).toBe('b-img-1');
    expect(form.get('type')?.value).toBe('image');
    expect(form.get('src')?.value).toBe('/photo.jpg');
    expect(form.get('alt')?.value).toBe('A scenic view');
    expect(form.get('caption')?.value).toBe('Beautiful landscape');
    expect(form.getRawValue()).toEqual(block);
  });

  it('should handle ImageBlock without optional caption', () => {
    const block: ImageBlock = {
      id: 'b-img-2',
      type: 'image',
      src: '/photo.jpg',
      alt: 'No caption',
    };

    const form = createBlockFormGroup(block);

    // The FormControl stores null for missing optional fields
    expect(form.get('caption')?.value).toBe(null);
    expect(form.getRawValue()).toEqual({ ...block, caption: null });
  });
});
