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
      theme: 'solaris',
      body: [
        { type: 'heading', level: 2, text: 'Why Signals?' },
        {
          type: 'paragraph',
          text: 'Angular Signals represent a fundamental shift in how we think about state management. Unlike traditional RxJS Observables which are pull-based and require subscriptions, Signals are push-based and automatically track dependencies.',
        },
        {
          type: 'code',
          language: 'typescript',
          text: 'const count = signal(0);\nconst doubled = computed(() => count() * 2);',
        },
        {
          type: 'paragraph',
          text: 'This means you no longer need to manually subscribe, unsubscribe, or manage async pipes. The framework handles all of that for you.',
        },
        { type: 'heading', level: 2, text: 'Key Benefits' },
        {
          type: 'paragraph',
          text: 'Automatic dependency tracking — computed signals know what they depend on',
        },
        {
          type: 'paragraph',
          text: 'No memory leaks — no manual subscription management',
        },
        {
          type: 'paragraph',
          text: 'Zoneless change detection — Signals can work without zone.js',
        },
        {
          type: 'paragraph',
          text: 'Simpler mental model — no Observables terminology needed',
        },
        {
          type: 'paragraph',
          text: 'The best part? Signals compose beautifully. You can build complex reactive chains that are still easy to reason about.',
        },
      ],
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
      theme: 'abyss',
      body: [
        { type: 'heading', level: 2, text: 'The Power of Perspective' },
        {
          type: 'paragraph',
          text: 'The secret to convincing 3D on the web is understanding the `perspective` property. Think of it as the distance between the viewer and the scene — smaller values create more dramatic depth.',
        },
        {
          type: 'code',
          language: 'css',
          text: '.card:hover {\n  transform: perspective(1000px) rotateX(5deg) rotateY(10deg);\n}',
        },
        { type: 'heading', level: 2, text: 'Building a Tilt Effect' },
        {
          type: 'paragraph',
          text: 'By combining `perspective`, `rotateX`, and `rotateY`, you can create a tilt effect that responds to mouse movement. This is exactly what we use in our PostCard component.',
        },
        {
          type: 'code',
          language: 'typescript',
          text: "@HostListener('mousemove', ['$event'])\nonMouseMove(event: MouseEvent) {\n  const { left, top, width, height } =\n    this.element.getBoundingClientRect();\n  const x = (event.clientX - left) / width - 0.5;\n  const y = (event.clientY - top) / height - 0.5;\n  this.renderer.setStyle(\n    this.element,\n    'transform',\n    `perspective(1000px) rotateX(${y * -20}deg) rotateY(${x * 20}deg)`\n  );\n}",
        },
        {
          type: 'paragraph',
          text: 'No libraries needed — just pure CSS and a dash of JavaScript.',
        },
      ],
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
      theme: 'neon',
      body: [
        { type: 'heading', level: 2, text: 'The Problem with Markdown' },
        {
          type: 'paragraph',
          text: 'Markdown is great for simple documents, but it falls apart when you need:',
        },
        {
          type: 'paragraph',
          text: 'Embedded media with custom alignment',
        },
        {
          type: 'paragraph',
          text: 'Interactive components within content',
        },
        {
          type: 'paragraph',
          text: 'Per-block styling or metadata',
        },
        {
          type: 'paragraph',
          text: 'Drag-and-drop reordering',
        },
        { type: 'heading', level: 2, text: 'Enter JSON Blocks' },
        {
          type: 'paragraph',
          text: 'Instead of a flat Markdown string, we store content as an array of block objects:',
        },
        {
          type: 'code',
          language: 'json',
          text: '[\n  { "type": "heading", "level": 2, "text": "Why Blocks?" },\n  { "type": "paragraph", "text": "Each block is independent..." },\n  { "type": "code", "language": "typescript", "text": "..." },\n  { "type": "image", "src": "...", "alt": "..." }\n]',
        },
        {
          type: 'paragraph',
          text: 'This approach gives us the flexibility of a structured content model with the simplicity of JSON. Every block is self-contained, independently styled, and easily reorderable.',
        },
      ],
    },
  ]);

  readonly getPosts = this.posts.asReadonly();

  getPostBySlug(slug: string): Post | undefined {
    return this.posts().find((post) => post.slug === slug);
  }
  updatePost(slug: string, changes: Partial<Post>): void {
    this.posts.update((current) =>
      current.map((p) => (p.slug === slug ? { ...p, ...changes } : p)),
    );
  }
}
