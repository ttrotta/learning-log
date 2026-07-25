import { Directive, ElementRef, OnDestroy, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnDestroy {
  private readonly maxTilt = 15;
  private readonly perspective = '600px';
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly unlisten: () => void;

  constructor() {
    this.unlisten = this.renderer.listen(
      this.el.nativeElement,
      'mousemove',
      (event: MouseEvent) => this.onMouseMove(event),
    );

    this.renderer.listen(this.el.nativeElement, 'mouseleave', () =>
      this.onMouseLeave(),
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
      'transition',
      'transform 0.1s ease-out',
    );
  }

  private onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
    this.renderer.removeStyle(this.el.nativeElement, 'transition');
  }

  ngOnDestroy(): void {
    this.unlisten();
  }
}
