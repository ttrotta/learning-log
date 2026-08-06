import { TestBed } from '@angular/core/testing';
import { ParagraphRendererComponent } from './paragraph-renderer';
import type { ParagraphBlock } from '../types';

describe('ParagraphRendererComponent', () => {
  function setup(block: ParagraphBlock) {
    const fixture = TestBed.createComponent(ParagraphRendererComponent);
    fixture.componentRef.setInput('block', block);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render p tag with text', () => {
    const { fixture } = setup({
      id: 'b-test-p1',
      type: 'paragraph',
      text: 'Hello world',
    });
    const p = (fixture.nativeElement as HTMLElement).querySelector('p');
    expect(p).toBeTruthy();
    expect(p!.textContent).toBe('Hello world');
  });

  it('should render a different paragraph text', () => {
    const { fixture } = setup({
      id: 'b-test-p2',
      type: 'paragraph',
      text: 'Another paragraph with content',
    });
    const p = (fixture.nativeElement as HTMLElement).querySelector('p');
    expect(p).toBeTruthy();
    expect(p!.textContent).toBe('Another paragraph with content');
  });
});
