import { Service, signal } from '@angular/core';
import type { Post } from '../models/post.model';
import { initialPosts } from './post.data';

@Service()
export class PostService {
  private readonly posts = signal<Post[]>(initialPosts);

  readonly getPosts = this.posts.asReadonly();

  getPostBySlug(slug: string): Post | undefined {
    return this.posts().find((post) => post.slug === slug);
  }

  addPost(post: Post): void {
    if (this.posts().some((p) => p.slug === post.slug)) {
      throw new Error(`Slug "${post.slug}" is already taken`);
    }
    this.posts.update((current) => [...current, post]);
  }

  updatePost(slug: string, changes: Partial<Post>): void {
    this.posts.update((current) =>
      current.map((p) => (p.slug === slug ? { ...p, ...changes } : p)),
    );
  }

  deletePost(slug: string): void {
    this.posts.update((current) => current.filter((p) => p.slug !== slug));
  }
}
