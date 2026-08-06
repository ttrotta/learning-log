import { TestBed } from '@angular/core/testing';
import { BlockRendererComponent } from './block-renderer';
import type { Block } from './types';

describe('BlockRendererComponent', () => {
  function setup(blocks: Block[]) {
    const fixture = TestBed.createComponent(BlockRendererComponent);
    fixture.componentRef.setInput('blocks', blocks);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render all four block types', () => {
    const blocks: Block[] = [
      { id: 'b-h1', type: 'heading', level: 2, text: 'Section' },
      { id: 'b-p1', type: 'paragraph', text: 'A paragraph.' },
      { id: 'b-c1', type: 'code', language: 'js', text: 'const a = 1;' },
      { id: 'b-i1', type: 'image', src: '/pic.jpg', alt: 'Pic' },
    ];
    const { fixture } = setup(blocks);
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h2')).toBeTruthy();
    expect(el.querySelector('h2')!.textContent).toBe('Section');
    expect(el.querySelector('p')).toBeTruthy();
    expect(el.querySelector('p')!.textContent).toBe('A paragraph.');
    expect(el.querySelector('pre')).toBeTruthy();
    expect(el.querySelector('code')).toBeTruthy();
    expect(el.querySelector('img')).toBeTruthy();
    expect(el.querySelector('img')!.getAttribute('src')).toBe('/pic.jpg');
  });

  it('should render nothing for unknown block type without errors', () => {
    const blocks = [{ id: 'b-unknown', type: 'unknown' } as unknown as Block];
    const { fixture } = setup(blocks);
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h2')).toBeFalsy();
    expect(el.querySelector('p')).toBeFalsy();
    expect(el.querySelector('pre')).toBeFalsy();
    expect(el.querySelector('img')).toBeFalsy();
  });
});
