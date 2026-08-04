import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render the brand as a link, not a heading', async () => {
    const { fixture } = await setup();
    const el: HTMLElement = fixture.nativeElement;

    const brand = el.querySelector('a.navbar__brand');
    expect(brand).toBeTruthy();
    expect(brand?.tagName).toBe('A');
    expect(brand?.getAttribute('href')).toBe('/');
    expect(brand?.textContent).toContain('Learning Log');
    expect(el.querySelector('h1')).toBeNull();
  });

  it('should render navigation links', async () => {
    const { fixture } = await setup();
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a.navbar__link'),
    ) as HTMLAnchorElement[];

    expect(links.length).toBeGreaterThanOrEqual(2);
    const text = links.map((link) => link.textContent?.trim());
    expect(text).toContain('Home');
    expect(text).toContain('New Post');
    expect(links.find((link) => link.textContent?.trim() === 'Home')?.getAttribute('href')).toBe(
      '/',
    );
  });

  it('should offer a native details/summary disclosure for narrow viewports', async () => {
    const { fixture } = await setup();
    const el: HTMLElement = fixture.nativeElement;

    const details = el.querySelector('details.navbar__menu');
    expect(details).toBeTruthy();
    expect(details?.querySelector('summary.navbar__menu-toggle')).toBeTruthy();
    expect(details?.querySelector('nav, [role="navigation"]')).toBeTruthy();
  });

  it('should not carry any post theme class', async () => {
    const { fixture } = await setup();
    const root = fixture.nativeElement.firstElementChild as HTMLElement;

    for (const className of Array.from(root.classList)) {
      expect(className.startsWith('theme-')).toBe(false);
    }
  });
});
