export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: Date;
  tags: string[];
  coverColor: string;
}