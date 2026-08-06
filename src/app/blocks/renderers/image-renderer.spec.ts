import { TestBed } from '@angular/core/testing';
import { ImageRendererComponent } from './image-renderer';
import type { ImageBlock } from '../types';

describe('ImageRendererComponent', () => {
  function setup(block: ImageBlock) {
    const fixture = TestBed.createComponent(ImageRendererComponent);
    fixture.componentRef.setInput('block', block);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render img with src and alt', () => {
    const { fixture } = setup({
      id: 'b-test-i1',
      type: 'image',
      src: '/photo.jpg',
      alt: 'A photo',
    });
    const img = (fixture.nativeElement as HTMLElement).querySelector('img');
    expect(img).toBeTruthy();
    expect(img!.getAttribute('src')).toBe('/photo.jpg');
    expect(img!.getAttribute('alt')).toBe('A photo');
  });

  it('should render figcaption when caption is provided', () => {
    const { fixture } = setup({
      id: 'b-test-i2',
      type: 'image',
      src: '/photo.jpg',
      alt: 'A photo',
      caption: 'Beautiful view',
    });
    const figcaption = (fixture.nativeElement as HTMLElement).querySelector(
      'figcaption',
    );
    expect(figcaption).toBeTruthy();
    expect(figcaption!.textContent).toBe('Beautiful view');
  });

  it('should NOT render figcaption when caption is absent', () => {
    const { fixture } = setup({
      id: 'b-test-i3',
      type: 'image',
      src: '/photo.jpg',
      alt: 'A photo',
    });
    const figcaption = (fixture.nativeElement as HTMLElement).querySelector(
      'figcaption',
    );
    expect(figcaption).toBeFalsy();
  });
});
