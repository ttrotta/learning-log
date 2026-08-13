import {
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  RendererStyleFlags2,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnDestroy {
  private readonly maxTilt = 15;
  private readonly perspective = '600px';
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly unlisten: Array<() => void> = [];

  constructor() {
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      return;
    }

    this.unlisten.push(
      this.renderer.listen(
        this.el.nativeElement,
        'mousemove',
        (event: MouseEvent) => this.onMouseMove(event),
      ),
    );

    this.unlisten.push(
      this.renderer.listen(this.el.nativeElement, 'mouseleave', () =>
        this.onMouseLeave(),
      ),
    );
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const rotateY = (deltaX / (rect.width / 2)) * this.maxTilt;
    const rotateX = -(deltaY / (rect.height / 2)) * this.maxTilt;

    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `perspective(${this.perspective}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      '--tilt-x',
      `${rotateY}`,
      RendererStyleFlags2.DashCase,
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      '--tilt-y',
      `${rotateX}`,
      RendererStyleFlags2.DashCase,
    );
  }

  private onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
    this.renderer.removeStyle(this.el.nativeElement, '--tilt-x');
    this.renderer.removeStyle(this.el.nativeElement, '--tilt-y');
  }

  ngOnDestroy(): void {
    this.unlisten.forEach((unlisten) => unlisten());
  }
}
