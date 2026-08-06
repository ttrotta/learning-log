import { Component, computed, effect, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { BlockRendererComponent } from '../../blocks/block-renderer';
import { ToolbarComponent } from '../../editor/toolbar';
import { EditorBlockComponent } from '../../editor/editor-block';
import { createBlockFormGroup } from '../../utils/block-form';
import { THEMES, type ThemeName } from '../../theme/theme-catalog';
import type { Block, BlockType, ParagraphBlock } from '../../blocks/types';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    BlockRendererComponent,
    ToolbarComponent,
    EditorBlockComponent,
  ],
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class EditorPage {
  readonly slug = input<string>();

  private readonly postService = inject(PostService);
  private readonly router = inject(Router);

  protected readonly metadataForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    excerpt: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tags: new FormControl('', { nonNullable: true }),
    theme: new FormControl<ThemeName>('paper', { nonNullable: true }),
  });

  protected readonly themes = THEMES;

  protected readonly blockFormArray = new FormArray<FormGroup>([]);

  private readonly existingPost = computed(() => {
    const s = this.slug();
    return s ? this.postService.getPostBySlug(s) : undefined;
  });

  protected readonly postNotFound = computed(() => {
    const s = this.slug();
    return !!s && this.existingPost() === undefined;
  });

  protected get previewBlocks(): Block[] {
    return this.blockFormArray.getRawValue() as Block[];
  }

  constructor() {
    effect(() => {
      const post = this.existingPost();
      const s = this.slug();

      if (s && post !== undefined) {
        this.metadataForm.patchValue({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          tags: post.tags.join(', '),
          theme: post.theme,
        });
        this.blockFormArray.clear();
        for (const block of post.body) {
          this.blockFormArray.push(createBlockFormGroup(block));
        }
      }
    });

    // Add default paragraph block for new posts
    effect(() => {
      const s = this.slug();
      if ((s === undefined || s === '') && this.blockFormArray.length === 0) {
        const defaultBlock: ParagraphBlock = {
          id: crypto.randomUUID(),
          type: 'paragraph',
          text: '',
        };
        this.blockFormArray.push(createBlockFormGroup(defaultBlock));
      }
    });
  }

  protected addBlock(type: BlockType): void {
    const id = crypto.randomUUID();
    let block: Block;
    switch (type) {
      case 'heading':
        block = { id, type: 'heading', level: 2, text: '' };
        break;
      case 'paragraph':
        block = { id, type: 'paragraph', text: '' };
        break;
      case 'code':
        block = { id, type: 'code', language: 'typescript', text: '' };
        break;
      case 'image':
        block = { id, type: 'image', src: '', alt: '', caption: null as unknown as undefined };
        break;
    }
    this.blockFormArray.push(createBlockFormGroup(block!));
  }

  protected removeBlock(index: number): void {
    this.blockFormArray.removeAt(index);
  }

  protected drop(event: CdkDragDrop<FormGroup[]>): void {
    moveItemInArray(
      this.blockFormArray.controls,
      event.previousIndex,
      event.currentIndex,
    );
    this.blockFormArray.updateValueAndValidity();
  }

  protected autoGenerateSlug(): void {
    const title = this.metadataForm.get('title')?.value as string;
    const slugControl = this.metadataForm.get('slug');
    if (title && slugControl && !slugControl.dirty) {
      slugControl.setValue(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      );
    }
  }

  protected save(): void {
    if (this.metadataForm.invalid) return;

    const metadata = this.metadataForm.getRawValue();
    const blocks = this.blockFormArray.getRawValue() as Block[];
    const tags = metadata.tags
      ? (metadata.tags as string)
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const post = {
      id: crypto.randomUUID(),
      title: metadata.title as string,
      slug: metadata.slug as string,
      excerpt: metadata.excerpt as string,
      createdAt: new Date(),
      tags,
      theme: metadata.theme,
      body: blocks,
    };

    const existing = this.slug();

    try {
      if (existing) {
        this.postService.updatePost(existing, post);
      } else {
        this.postService.addPost(post);
      }
      void this.router.navigate(['/post', metadata.slug as string]);
    } catch {
      const slugControl = this.metadataForm.get('slug');
      slugControl?.setErrors({ slugTaken: true });
    }
  }
}
