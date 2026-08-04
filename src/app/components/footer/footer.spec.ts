import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render neutral meta with the project name and year', async () => {
    const { fixture } = await setup();
    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(text).toContain('Learning Log');
    expect(text).toMatch(/20\d{2}/);
  });

  it('should render link navigation', async () => {
    const { fixture } = await setup();
    const links = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[];

    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]?.getAttribute('href')).toBeTruthy();
  });

  it('should not carry any post theme class', async () => {
    const { fixture } = await setup();
    const root = fixture.nativeElement.firstElementChild as HTMLElement;

    for (const className of Array.from(root.classList)) {
      expect(className.startsWith('theme-')).toBe(false);
    }
  });
});
