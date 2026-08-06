import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FormArray } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EditorPage } from './editor';
import { PostService } from '../../services/post.service';
import { THEMES } from '../../theme/theme-catalog';
import type { BlockType } from '../../blocks/types';

describe('EditorPage', () => {
  async function setup(slug?: string) {
    await TestBed.configureTestingModule({
      imports: [EditorPage],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(EditorPage);
    if (slug) {
      fixture.componentRef.setInput('slug', slug);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance as any };
  }

  describe('Task 2.1 — Editor page scenarios', () => {
    it('should render metadata form and default paragraph block for new post', async () => {
      const { fixture } = await setup();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('[formControlName="title"]')).toBeTruthy();
      expect(el.querySelector('[formControlName="slug"]')).toBeTruthy();
      expect(el.querySelector('[formControlName="excerpt"]')).toBeTruthy();

      const blockItems = el.querySelectorAll('[data-testid="block-item"]');
      expect(blockItems.length).toBe(1);

      expect(el.querySelector('[data-testid="preview-panel"]')).toBeTruthy();
    });

    it('should populate form when loading existing post', async () => {
      const { fixture } = await setup('getting-started-angular-signals');
      const el = fixture.nativeElement as HTMLElement;

      const titleInput = el.querySelector(
        '[formControlName="title"]',
      ) as HTMLInputElement;
      expect(titleInput.value).toBe('Getting Started with Angular Signals');

      const slugInput = el.querySelector(
        '[formControlName="slug"]',
      ) as HTMLInputElement;
      expect(slugInput.value).toBe('getting-started-angular-signals');

      const blockItems = el.querySelectorAll('[data-testid="block-item"]');
      expect(blockItems.length).toBeGreaterThan(1);
    });

    it('should show Post not found for invalid slug', async () => {
      const { fixture } = await setup('non-existent-slug');
      const el = fixture.nativeElement as HTMLElement;

      expect(el.textContent).toContain('Post not found');
      expect(el.querySelector('[data-testid="editor-form"]')).toBeFalsy();
    });
  });

  describe('Task 2.15 — Integration: add/remove blocks', () => {
    it('should add a paragraph block via addBlock', async () => {
      const { fixture, component } = await setup();
      const initialCount = component.blockFormArray.length;

      component.addBlock('paragraph');

      expect(component.blockFormArray.length).toBe(initialCount + 1);
      const added = component.blockFormArray.at(component.blockFormArray.length - 1);
      expect(added.get('type')?.value).toBe('paragraph');
    });

    it('should add blocks of each type', async () => {
      const { component } = await setup();
      const types: BlockType[] = ['heading', 'paragraph', 'code', 'image'];

      for (const type of types) {
        component.addBlock(type);
        const added = component.blockFormArray.at(component.blockFormArray.length - 1);
        expect(added.get('type')?.value).toBe(type);
      }
    });

    it('should remove a block at a given index', async () => {
      const { component } = await setup();

      component.addBlock('heading');
      component.addBlock('code');
      const initialCount = component.blockFormArray.length;

      component.removeBlock(initialCount - 1);

      expect(component.blockFormArray.length).toBe(initialCount - 1);
      const lastBlock = component.blockFormArray.at(component.blockFormArray.length - 1);
      expect(lastBlock.get('type')?.value).toBe('heading');
    });

    it('should reorder blocks via drop handler', async () => {
      const { component } = await setup();

      component.addBlock('heading');
      component.addBlock('code');

      expect(component.blockFormArray.length).toBe(3);
      const types = component.blockFormArray.controls.map(
        (c: any) => c.get('type')?.value,
      );
      expect(types).toEqual(['paragraph', 'heading', 'code']);

      const event = {
        previousIndex: 2,
        currentIndex: 0,
        item: {} as any,
        container: {} as any,
        previousContainer: {} as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('mouseup'),
      } as unknown as CdkDragDrop<FormArray>;

      component.drop(event);

      const newTypes = component.blockFormArray.controls.map(
        (c: any) => c.get('type')?.value,
      );
      expect(newTypes).toEqual(['code', 'paragraph', 'heading']);
    });
  });

  describe('Task 2.15 — Integration: preview sync with form edits', () => {
    it('should render preview panel with BlockRendererComponent', async () => {
      const { fixture } = await setup();

      const previewPanel = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="preview-panel"]',
      );
      expect(previewPanel).toBeTruthy();
      expect(previewPanel!.querySelector('app-block-renderer')).toBeTruthy();
    });

    it('should update preview blocks when blocks change', async () => {
      const { component } = await setup();

      const blocksBefore = component.previewBlocks;
      expect(blocksBefore.length).toBe(1);

      component.addBlock('heading');

      const blocksAfter = component.previewBlocks;
      expect(blocksAfter.length).toBe(2);
      expect(blocksAfter[1].type).toBe('heading');
    });

    it('should reflect text edits in preview blocks', async () => {
      const { component } = await setup();

      const firstBlock = component.blockFormArray.at(0);
      firstBlock.get('text')?.setValue('Edited text');

      const previewBlocks = component.previewBlocks;
      expect((previewBlocks[0] as any).text).toBe('Edited text');
    });
  });

  describe('Task 2.14 — Integration: save flow', () => {
    it('should call addPost on save for new post and navigate', async () => {
      const { component } = await setup();
      const postService = TestBed.inject(PostService);
      const router = TestBed.inject(Router);
      const initialCount = postService.getPosts().length;

      component.metadataForm.patchValue({
        title: 'Integration Test Post',
        slug: 'integration-test-post',
        excerpt: 'Test excerpt',
        tags: 'test, integration',
        theme: 'paper',
      });

      const navigateSpy = vi.spyOn(router, 'navigate');
      component.save();

      expect(postService.getPosts().length).toBe(initialCount + 1);
      const added = postService.getPostBySlug('integration-test-post');
      expect(added).toBeDefined();
      expect(added!.title).toBe('Integration Test Post');
      expect(navigateSpy).toHaveBeenCalledWith(['/post', 'integration-test-post']);
    });

    it('should call updatePost on save for existing post', async () => {
      const { component } = await setup('getting-started-angular-signals');
      const postService = TestBed.inject(PostService);
      const router = TestBed.inject(Router);

      component.metadataForm.patchValue({
        title: 'Updated Title',
        slug: 'getting-started-angular-signals',
      });

      const navigateSpy = vi.spyOn(router, 'navigate');
      component.save();

      const updated = postService.getPostBySlug('getting-started-angular-signals');
      expect(updated).toBeDefined();
      expect(updated!.title).toBe('Updated Title');
      expect(navigateSpy).toHaveBeenCalledWith(['/post', 'getting-started-angular-signals']);
    });

    it('should show slug error on duplicate slug', async () => {
      const { fixture, component } = await setup();

      component.metadataForm.patchValue({
        title: 'Duplicate Slug',
        slug: 'getting-started-angular-signals',
        excerpt: 'Test',
      });

      component.save();
      fixture.detectChanges();

      expect(component.metadataForm.get('slug')?.errors?.['slugTaken']).toBe(true);
      const errorEl = (fixture.nativeElement as HTMLElement).querySelector('.form-error');
      expect(errorEl).toBeTruthy();
      expect(errorEl!.textContent).toContain('Slug already taken');
    });
  });

  describe('Task 2.2 — Slug auto-generation', () => {
    it('should auto-generate slug from title', async () => {
      const { component } = await setup();

      component.metadataForm.patchValue({ title: 'My First Post' });
      component.autoGenerateSlug();

      expect(component.metadataForm.get('slug')?.value).toBe('my-first-post');
    });

    it('should not overwrite manually edited slug', async () => {
      const { component } = await setup();

      component.metadataForm.patchValue({ title: 'My Post' });
      component.metadataForm.get('slug')?.setValue('custom-slug');
      component.metadataForm.get('slug')?.markAsDirty();

      component.autoGenerateSlug();

      expect(component.metadataForm.get('slug')?.value).toBe('custom-slug');
    });
  });

  describe('Task 3.5 — Theme gallery', () => {
    it('should render a gallery with 6 theme tiles, no color input', async () => {
      const { fixture } = await setup();
      const el = fixture.nativeElement as HTMLElement;

      const gallery = el.querySelector('[data-testid="theme-gallery"]');
      expect(gallery).toBeTruthy();

      const tiles = gallery!.querySelectorAll('[data-testid="theme-tile"]');
      expect(tiles.length).toBe(THEMES.length);
      expect(tiles.length).toBe(6);

      expect(el.querySelector('[formControlName="coverColor"]')).toBeFalsy();
    });

    it('should default theme to paper for a new post', async () => {
      const { component } = await setup();

      expect(component.metadataForm.get('theme')?.value).toBe('paper');
    });

    it('should set the theme control when a tile is selected', async () => {
      const { fixture, component } = await setup();
      const el = fixture.nativeElement as HTMLElement;

      const neonTile = el.querySelector(
        '[data-testid="theme-tile"][data-theme="neon"]',
      ) as HTMLElement;
      expect(neonTile).toBeTruthy();
      neonTile.click();
      fixture.detectChanges();

      expect(component.metadataForm.get('theme')?.value).toBe('neon');
    });

    it('should save the selected theme instead of coverColor', async () => {
      const { component } = await setup();
      const postService = TestBed.inject(PostService);
      const router = TestBed.inject(Router);

      component.metadataForm.patchValue({
        title: 'Theme Save Test',
        slug: 'theme-save-test',
        excerpt: 'Test excerpt',
        tags: 'test',
        theme: 'meadow',
      });

      const navigateSpy = vi.spyOn(router, 'navigate');
      component.save();

      const added = postService.getPostBySlug('theme-save-test');
      expect(added).toBeDefined();
      expect(added!.theme).toBe('meadow');
      expect(Object.prototype.hasOwnProperty.call(added, 'coverColor')).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/post', 'theme-save-test']);
    });

    it('should populate theme from an existing post on edit', async () => {
      const { component } = await setup('getting-started-angular-signals');

      expect(component.metadataForm.get('theme')?.value).toBe('solaris');
    });
  });
});
