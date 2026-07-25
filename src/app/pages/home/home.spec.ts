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
    const cards =
      fixture.nativeElement.querySelectorAll('app-post-card');
    const service = TestBed.inject(PostService);
    expect(cards.length).toBe(service.getPosts().length);
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
