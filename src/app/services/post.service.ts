import { Injectable, signal } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly posts = signal<Post[]>([
    {
      id: '1',
      title: 'Getting Started with Angular Signals',
      slug: 'getting-started-angular-signals',
      excerpt:
        'Learn how Signals are transforming state management in Angular applications.',
      createdAt: new Date('2026-07-20'),
      tags: ['Angular', 'Signals', 'State Management'],
      coverColor: '#FF6B6B',
    },
    {
      id: '2',
      title: 'CSS 3D Transforms: A Practical Guide',
      slug: 'css-3d-transforms-guide',
      excerpt:
        'Master perspective, rotateX, and rotateY to create stunning 3D UI effects without libraries.',
      createdAt: new Date('2026-07-18'),
      tags: ['CSS', '3D', 'Animation'],
      coverColor: '#4ECDC4',
    },
    {
      id: '3',
      title: 'Building a Custom Block Editor',
      slug: 'building-custom-block-editor',
      excerpt:
        'Why JSON-based content blocks beat Markdown for creative blogging platforms.',
      createdAt: new Date('2026-07-15'),
      tags: ['Architecture', 'Editor', 'Content'],
      coverColor: '#45B7D1',
    },
  ]);

  readonly getPosts = this.posts.asReadonly();
}
