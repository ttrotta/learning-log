import { TestBed } from '@angular/core/testing';
import { CodeRendererComponent } from './code-renderer';
import type { CodeBlock } from '../types';

describe('CodeRendererComponent', () => {
  function setup(block: CodeBlock) {
    const fixture = TestBed.createComponent(CodeRendererComponent);
    fixture.componentRef.setInput('block', block);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render pre > code with language class', () => {
    const { fixture } = setup({
      id: 'b-test-c1',
      type: 'code',
      language: 'typescript',
      text: 'const x = 1;',
    });
    const pre = (fixture.nativeElement as HTMLElement).querySelector('pre');
    const code = (fixture.nativeElement as HTMLElement).querySelector('code');
    expect(pre).toBeTruthy();
    expect(code).toBeTruthy();
    expect(code!.classList.contains('language-typescript')).toBe(true);
    expect(code!.textContent).toContain('const x = 1;');
  });

  it('should render css code with correct language class', () => {
    const { fixture } = setup({
      id: 'b-test-c2',
      type: 'code',
      language: 'css',
      text: '.card { color: red; }',
    });
    const code = (fixture.nativeElement as HTMLElement).querySelector('code');
    expect(code!.classList.contains('language-css')).toBe(true);
    expect(code!.textContent).toContain('.card { color: red; }');
  });
});
