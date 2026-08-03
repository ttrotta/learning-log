import type { Block } from '../blocks/types';
import type { ThemeName } from '../theme/theme-catalog';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: Date;
  tags: string[];
  coverColor: string;
  theme?: ThemeName;
  body: Block[];
}