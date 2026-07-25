import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-detail',
  imports: [DatePipe],
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
