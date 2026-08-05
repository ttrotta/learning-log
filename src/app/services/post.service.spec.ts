import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model';

describe('PostService', () => {
  let service: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return at least 3 posts with all fields populated and Date instances', () => {
    const posts = service.getPosts();
    expect(posts.length).toBeGreaterThanOrEqual(3);
    posts.forEach((post: Post) => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.slug).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.tags.length).toBeGreaterThan(0);
      expect(post.theme).toBeTruthy();
    });
  });

  it('should give every seed a distinct curated theme', () => {
    const posts = service.getPosts();
    const themes = posts.map((p: Post) => p.theme);
    expect(new Set(themes).size).toBe(themes.length);
  });

  it('should include body field on Post model', () => {
    const posts = service.getPosts();
    expect(posts.length).toBeGreaterThanOrEqual(1);
    expect(posts[0].body).toBeTruthy();
  });

  it('should return a post when getPostBySlug finds a matching slug', () => {
    const post = service.getPostBySlug('getting-started-angular-signals');
    expect(post).toBeDefined();
    expect(post!.title).toBe('Getting Started with Angular Signals');
    expect(post!.body).toBeTruthy();
  });

  it('should return undefined when getPostBySlug does not find a matching slug', () => {
    const post = service.getPostBySlug('non-existent-slug');
    expect(post).toBeUndefined();
  });

  describe('updatePost', () => {
    it('should merge a partial theme change onto the matching post', () => {
      service.updatePost('getting-started-angular-signals', { theme: 'neon' });

      const post = service.getPostBySlug('getting-started-angular-signals');
      expect(post!.theme).toBe('neon');
      expect(post!.title).toBe('Getting Started with Angular Signals');
      expect(post!.slug).toBe('getting-started-angular-signals');
    });

    it('should merge a partial title change and keep the rest', () => {
      service.updatePost('building-custom-block-editor', { title: 'Updated Title' });

      const post = service.getPostBySlug('building-custom-block-editor');
      expect(post!.title).toBe('Updated Title');
      expect(post!.theme).toBe('neon');
      expect(post!.body.length).toBeGreaterThan(0);
    });

    it('should do nothing when updating a non-existent slug', () => {
      const initialCount = service.getPosts().length;

      service.updatePost('non-existent', { title: 'Nope' });

      expect(service.getPosts().length).toBe(initialCount);
      expect(service.getPostBySlug('non-existent')).toBeUndefined();
    });
  });
});
