import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PostCard } from './post-card';
import { Post } from '../../models/post.model';
import type { Block } from '../../blocks/types';

describe('PostCard', () => {
  const mockPost: Post = {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    excerpt: 'A test excerpt',
    createdAt: new Date('2026-07-20'),
    tags: ['Angular', 'Testing'],
    theme: 'solaris',
    body: [] as Block[],
  };

  async function setup(post: Post = mockPost) {
    await TestBed.configureTestingModule({
      imports: [PostCard],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PostCard);
    fixture.componentRef.setInput('post', post);
    fixture.detectChanges();
    return { fixture };
  }

  it('should render all post fields', async () => {
    const { fixture } = await setup();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.textContent).toContain('Test Post');
    expect(el.textContent).toContain('A test excerpt');
    expect(el.textContent).toContain('Angular');
    expect(el.textContent).toContain('Testing');
  });

  it('should require post input', async () => {
    await TestBed.configureTestingModule({
      imports: [PostCard],
      providers: [provideRouter([])],
    }).compileComponents();

    expect(() => {
      const fixture = TestBed.createComponent(PostCard);
      fixture.detectChanges();
    }).toThrow();
  });

  it('should have appTilt directive attribute on root element', async () => {
    const { fixture } = await setup();
    const root = (fixture.nativeElement as HTMLElement).firstElementChild;
    expect(root?.getAttribute('appTilt')).not.toBeNull();
  });

  it('should bind the resolved theme class on the root', async () => {
    const { fixture } = await setup();
    const root = (fixture.nativeElement as HTMLElement).firstElementChild as HTMLElement;
    expect(root.classList.contains('post-card')).toBe(true);
    expect(root.classList.contains('theme-solaris')).toBe(true);
  });

  it('should resolve an unknown theme to the paper fallback', async () => {
    const { fixture } = await setup({
      ...mockPost,
      theme: 'unknown' as never,
    });
    const root = (fixture.nativeElement as HTMLElement).firstElementChild as HTMLElement;
    expect(root.classList.contains('theme-paper')).toBe(true);
  });

  it('should not set an inline background color on the cover', async () => {
    const { fixture } = await setup();
    const cover = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="post-cover"]',
    );
    expect(cover).toBeTruthy();
    expect((cover as HTMLElement).style.backgroundColor).toBe('');
  });
});
