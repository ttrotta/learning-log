import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';
import { TiltDirective } from '../../directives/tilt.directive';
import { resolveTheme } from '../../theme/theme-catalog';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, TiltDirective, DatePipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {
  readonly post = input.required<Post>();
  readonly resolveTheme = resolveTheme;
}
