import { TestBed } from '@angular/core/testing';
import { TiltDirective } from './tilt.directive';
import { Component } from '@angular/core';

@Component({
  template: '<div appTilt style="width: 200px; height: 200px;">Tilt me</div>',
  imports: [TiltDirective],
  standalone: true,
})
class TestHostComponent {}

describe('TiltDirective', () => {
  async function setup(reducedMotion = false) {
    const mediaQueryList = {
      matches: reducedMotion,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    };

    if (typeof window.matchMedia !== 'function') {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockReturnValue(mediaQueryList as unknown as MediaQueryList),
      });
    } else {
      vi.spyOn(window, 'matchMedia').mockReturnValue(
        mediaQueryList as unknown as MediaQueryList,
      );
    }

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const element: HTMLElement =
      fixture.nativeElement.querySelector('[appTilt]');

    // jsdom elements have no real layout, so stub getBoundingClientRect
    const original = element.getBoundingClientRect.bind(element);
    element.getBoundingClientRect = () =>
      ({ width: 200, height: 200, left: 0, top: 0 }) as DOMRect;

    return { fixture, element, original };
  }

  it('should apply transform on mousemove', async () => {
    const { element } = await setup();
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
    });
    element.dispatchEvent(event);

    const transform = element.style.transform;
    expect(transform).toContain('perspective(');
    expect(transform).toContain('rotateX(');
    expect(transform).toContain('rotateY(');
  });

  it('should gracefully degrade without mouse events', async () => {
    const { element } = await setup();
    expect(element.style.transform).toBe('');
  });

  it('should clean up transform on mouseleave', async () => {
    const { element } = await setup();

    const moveEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
    });
    element.dispatchEvent(moveEvent);
    expect(element.style.transform).toContain('rotateX(');

    const leaveEvent = new MouseEvent('mouseleave');
    element.dispatchEvent(leaveEvent);
    expect(element.style.transform).toBe('');
  });

  it('should NOT apply transform on mousemove when reduce motion is active', async () => {
    const { element } = await setup(true);

    const moveEvent = new MouseEvent('mousemove', {
      clientX: 120,
      clientY: 130,
    });
    element.dispatchEvent(moveEvent);

    expect(element.style.transform).toBe('');
  });
});
