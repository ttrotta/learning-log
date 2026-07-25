import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { PostDetail } from './post-detail';

describe('PostDetail', () => {
  async function setup(slug: string) {
    await TestBed.configureTestingModule({
      imports: [PostDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PostDetail);
    fixture.componentRef.setInput('slug', slug);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture };
  }

  it('should render hero with coverColor, title, date, tags, and body for valid slug', async () => {
    const { fixture } = await setup('getting-started-angular-signals');
    const el: HTMLElement = fixture.nativeElement;

    expect(el.textContent).toContain('Getting Started with Angular Signals');
    expect(el.textContent).toContain('Angular');
    expect(el.textContent).toContain('Signals');
    expect(el.textContent).toContain('Why Signals?');
    expect(el.textContent).toContain('Automatic dependency tracking');

    const hero = el.querySelector('.post-detail__hero');
    expect(hero).toBeTruthy();
    expect((hero as HTMLElement).style.backgroundColor).toBe('rgb(255, 107, 107)');
  });

  it('should show "Post not found" for invalid slug', async () => {
    const { fixture } = await setup('non-existent-slug');
    const el: HTMLElement = fixture.nativeElement;

    expect(el.textContent).toContain('Post not found');
    expect(el.querySelector('.post-detail__hero')).toBeFalsy();
    expect(el.querySelector('.post-detail__body')).toBeFalsy();
  });

  it('should display formatted date and tag badges for valid slug', async () => {
    const { fixture } = await setup('css-3d-transforms-guide');
    const el: HTMLElement = fixture.nativeElement;

    expect(el.textContent).toContain('CSS 3D Transforms: A Practical Guide');
    expect(el.textContent).toContain('CSS');
    expect(el.textContent).toContain('3D');
    expect(el.textContent).toContain('Animation');
    expect(el.textContent).toContain('The Power of Perspective');
  });

  it('should navigate to /post/{slug} and render PostDetail with route param binding', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PostDetail],
      providers: [
        provideRouter(
          [
            {
              path: 'post/:slug',
              loadComponent: () =>
                import('./post-detail').then((m) => m.PostDetail),
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/post/getting-started-angular-signals',
      PostDetail,
    );

    expect(component).toBeInstanceOf(PostDetail);
    expect(component.slug()).toBe('getting-started-angular-signals');
    expect(harness.routeDebugElement?.nativeElement.textContent).toContain(
      'Getting Started with Angular Signals',
    );
  });
});
