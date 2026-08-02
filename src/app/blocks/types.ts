export type BlockType = 'heading' | 'paragraph' | 'code' | 'image';

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface CodeBlock {
  type: 'code';
  language: string;
  text: string;
}

export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}

export type Block = HeadingBlock | ParagraphBlock | CodeBlock | ImageBlock;
