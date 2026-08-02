import { TestBed } from '@angular/core/testing';
import { HeadingRendererComponent } from './heading-renderer';
import type { HeadingBlock } from '../types';

describe('HeadingRendererComponent', () => {
  function setup(block: HeadingBlock) {
    const fixture = TestBed.createComponent(HeadingRendererComponent);
    fixture.componentRef.setInput('block', block);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render h1 for level 1', () => {
    const { fixture } = setup({ type: 'heading', level: 1, text: 'Title A' });
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1!.textContent).toBe('Title A');
  });

  it('should render h3 for level 3', () => {
    const { fixture } = setup({ type: 'heading', level: 3, text: 'Sub Title' });
    const h3 = (fixture.nativeElement as HTMLElement).querySelector('h3');
    expect(h3).toBeTruthy();
    expect(h3!.textContent).toBe('Sub Title');
  });

  it('should render h6 for level 6', () => {
    const { fixture } = setup({ type: 'heading', level: 6, text: 'Deepest' });
    const h6 = (fixture.nativeElement as HTMLElement).querySelector('h6');
    expect(h6).toBeTruthy();
    expect(h6!.textContent).toBe('Deepest');
  });
});
