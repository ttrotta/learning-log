import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostService } from '../../services/post.service';
import { BlockRendererComponent } from '../../blocks/block-renderer';

@Component({
  selector: 'app-post-detail',
  imports: [DatePipe, BlockRendererComponent],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css',
})
export class PostDetail {
  readonly slug = input.required<string>();

  private readonly postService = inject(PostService);

  readonly post = computed(() => {
    return this.postService.getPostBySlug(this.slug());
  });
}
