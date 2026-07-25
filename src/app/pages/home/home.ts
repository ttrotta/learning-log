import { Component, inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { PostCard } from '../../components/post-card/post-card';

@Component({
  selector: 'app-home',
  imports: [PostCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly postService = inject(PostService);
  readonly posts = this.postService.getPosts;
}
