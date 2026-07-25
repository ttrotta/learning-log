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
      expect(post.coverColor).toBeTruthy();
    });
  });

  it('should have distinct coverColor values for each post', () => {
    const posts = service.getPosts();
    const colors = posts.map((p: Post) => p.coverColor);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
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
});
