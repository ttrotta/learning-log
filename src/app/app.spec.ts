import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the shell with router outlet, navbar, and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should keep the shell chrome neutral — no post theme class on navbar or footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const chrome = [
      compiled.querySelector('app-navbar'),
      compiled.querySelector('app-footer'),
    ].filter((el): el is HTMLElement => el !== null);

    expect(chrome.length).toBe(2);
    for (const node of chrome) {
      const root = node.firstElementChild as HTMLElement | null;
      expect(root).toBeTruthy();
      for (const className of Array.from(root?.classList ?? [])) {
        expect(className.startsWith('theme-')).toBe(false);
      }
    }
  });

  it('should render ambient background blobs marked as decorative', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const blobs = fixture.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(blobs.length).toBeGreaterThan(0);
  });
});
