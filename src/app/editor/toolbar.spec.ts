import { TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar';

describe('ToolbarComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(ToolbarComponent);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render add buttons for all four block types', () => {
    const { fixture } = setup();
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');

    expect(buttons.length).toBe(4);
  });

  it('should emit heading when heading button is clicked', () => {
    const { fixture } = setup();
    let emitted: string | undefined;

    fixture.componentInstance.add.subscribe((type) => {
      emitted = type;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const headingBtn = Array.from(buttons).find((b) => b.textContent?.includes('Heading'));
    headingBtn?.click();

    expect(emitted).toBe('heading');
  });

  it('should emit paragraph when paragraph button is clicked', () => {
    const { fixture } = setup();
    let emitted: string | undefined;

    fixture.componentInstance.add.subscribe((type) => {
      emitted = type;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const paragraphBtn = Array.from(buttons).find((b) => b.textContent?.includes('Paragraph'));
    paragraphBtn?.click();

    expect(emitted).toBe('paragraph');
  });

  it('should emit code when code button is clicked', () => {
    const { fixture } = setup();
    let emitted: string | undefined;

    fixture.componentInstance.add.subscribe((type) => {
      emitted = type;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const codeBtn = Array.from(buttons).find((b) => b.textContent?.includes('Code'));
    codeBtn?.click();

    expect(emitted).toBe('code');
  });

  it('should emit image when image button is clicked', () => {
    const { fixture } = setup();
    let emitted: string | undefined;

    fixture.componentInstance.add.subscribe((type) => {
      emitted = type;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const imageBtn = Array.from(buttons).find((b) => b.textContent?.includes('Image'));
    imageBtn?.click();

    expect(emitted).toBe('image');
  });
});
