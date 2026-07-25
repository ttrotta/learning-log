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
      body: '## Why Signals?\n\nAngular Signals represent a fundamental shift in how we think about state management. Unlike traditional RxJS Observables which are pull-based and require subscriptions, Signals are push-based and automatically track dependencies.\n\n```typescript\nconst count = signal(0);\nconst doubled = computed(() => count() * 2);\n```\n\nThis means you no longer need to manually subscribe, unsubscribe, or manage async pipes. The framework handles all of that for you.\n\n## Key Benefits\n\n1. **Automatic dependency tracking** — computed signals know what they depend on\n2. **No memory leaks** — no manual subscription management\n3. **Zoneless change detection** — Signals can work without zone.js\n4. **Simpler mental model** — no Observables terminology needed\n\nThe best part? Signals compose beautifully. You can build complex reactive chains that are still easy to reason about.',
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
      body: '## The Power of Perspective\n\nThe secret to convincing 3D on the web is understanding the `perspective` property. Think of it as the distance between the viewer and the scene — smaller values create more dramatic depth.\n\n```css\n.card:hover {\n  transform: perspective(1000px) rotateX(5deg) rotateY(10deg);\n}\n```\n\n## Building a Tilt Effect\n\nBy combining `perspective`, `rotateX`, and `rotateY`, you can create a tilt effect that responds to mouse movement. This is exactly what we use in our PostCard component.\n\n```typescript\n@HostListener(\'mousemove\', [\'$event\'])\nonMouseMove(event: MouseEvent) {\n  const { left, top, width, height } =\n    this.element.getBoundingClientRect();\n  const x = (event.clientX - left) / width - 0.5;\n  const y = (event.clientY - top) / height - 0.5;\n  this.renderer.setStyle(\n    this.element,\n    \'transform\',\n    `perspective(1000px) rotateX(${y * -20}deg) rotateY(${x * 20}deg)`\n  );\n}\n```\n\nNo libraries needed — just pure CSS and a dash of JavaScript.',
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
      body: '## The Problem with Markdown\n\nMarkdown is great for simple documents, but it falls apart when you need:\n\n- Embedded media with custom alignment\n- Interactive components within content\n- Per-block styling or metadata\n- Drag-and-drop reordering\n\n## Enter JSON Blocks\n\nInstead of a flat Markdown string, we store content as an array of block objects:\n\n```json\n[\n  { "type": "heading", "level": 2, "text": "Why Blocks?" },\n  { "type": "paragraph", "text": "Each block is independent..." },\n  { "type": "code", "language": "typescript", "text": "..." },\n  { "type": "image", "src": "...", "alt": "..." }\n]\n```\n\nThis approach gives us the flexibility of a structured content model with the simplicity of JSON. Every block is self-contained, independently styled, and easily reorderable.',
    },
  ]);

  readonly getPosts = this.posts.asReadonly();

  getPostBySlug(slug: string): Post | undefined {
    return this.posts().find((post) => post.slug === slug);
  }
}
