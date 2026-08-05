import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

describe('Home', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    return { fixture };
  }

  it('should create', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render PostCard for each post from service', async () => {
    const { fixture } = await setup();
    const cards = fixture.nativeElement.querySelectorAll('app-post-card');
    const service = TestBed.inject(PostService);
    expect(cards.length).toBe(service.getPosts().length);
  });

  it('should render exactly one editorial h1, not the brand', async () => {
    const { fixture } = await setup();
    const h1s = fixture.nativeElement.querySelectorAll('h1');

    expect(h1s.length).toBe(1);
    const h1 = h1s[0] as HTMLElement;
    expect(h1.textContent).toContain('floating log');
    expect(h1.getAttribute('class')).toContain('home__title');
  });

  it('should retain the subtitle under the editorial heading', async () => {
    const { fixture } = await setup();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Thoughts on code, design, and building things.');
  });

  it('should show empty state when no posts', async () => {
    const emptySignal = signal<Post[]>([]);

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        {
          provide: PostService,
          useFactory: () => {
            const service = new PostService();
            Object.defineProperty(service, 'getPosts', {
              get: () => emptySignal.asReadonly(),
            });
            return service;
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('No posts yet');
  });
});
