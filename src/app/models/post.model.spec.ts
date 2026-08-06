import { describe, expect, it } from 'vitest';
import { Post } from './post.model';
import type { ThemeName } from '../theme/theme-catalog';

function makePost(theme: ThemeName): Post {
  return {
    id: 'p-1',
    title: 'Themed Post',
    slug: 'themed-post',
    excerpt: 'A placeholder-style test excerpt.',
    createdAt: new Date('2026-07-20'),
    tags: ['theme'],
    theme,
    body: [{ id: 'b-1', type: 'paragraph', text: 'Hello.' }],
  };
}

describe('Post model', () => {
  it('carries a curated theme value on the model', () => {
    const post = makePost('neon');
    expect(post.theme).toBe('neon');
  });

  it('accepts every curated ThemeName', () => {
    const themes: ThemeName[] = ['solaris', 'abyss', 'neon', 'meadow', 'candy', 'paper'];
    const posts = themes.map(makePost);
    expect(posts.map((post) => post.theme)).toEqual(themes);
  });

  it('no longer carries the removed coverColor field', () => {
    const post = makePost('paper');
    expect(Object.prototype.hasOwnProperty.call(post, 'coverColor')).toBe(false);
  });
});