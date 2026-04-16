let activeScrollFrameId = 0;
let activeScrollGeneration = 0;

export interface SmoothScrollOptions {
  align?: 'start' | 'center';
  duration?: number;
  offset?: number;
}

function getScrollingElement() {
  if (typeof document === 'undefined') {
    return null;
  }

  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement ?? document.body ?? null;
}

function setWindowScrollPosition(nextY: number) {
  const scrollRoot = getScrollingElement();
  const safeY = Math.max(0, nextY);

  if (scrollRoot) {
    scrollRoot.scrollTop = safeY;
    return;
  }

  window.scrollTo(0, safeY);
}

export function scrollWindowToTop() {
  if (typeof window === 'undefined') {
    return;
  }

  cancelSmoothScroll();
  setWindowScrollPosition(0);
}

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function cancelSmoothScroll() {
  activeScrollGeneration += 1;

  if (activeScrollFrameId) {
    window.cancelAnimationFrame(activeScrollFrameId);
    activeScrollFrameId = 0;
  }
}

export function smoothScrollToElement(
  target: string | HTMLElement | null,
  options: SmoothScrollOptions = {},
) {
  if (typeof window === 'undefined') {
    return;
  }

  const element = typeof target === 'string' ? document.getElementById(target) : target;

  if (!element) {
    return;
  }

  cancelSmoothScroll();

  const scrollGeneration = activeScrollGeneration;

  const elementRect = element.getBoundingClientRect();
  const currentY = getScrollingElement()?.scrollTop ?? window.scrollY;
  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const align = options.align ?? 'start';
  const offset = options.offset ?? 0;

  const alignedTargetY =
    align === 'center'
      ? currentY + elementRect.top - window.innerHeight / 2 + elementRect.height / 2 - offset
      : currentY + elementRect.top - offset;

  const targetY = Math.min(maxScrollY, Math.max(0, alignedTargetY));
  const travelDistance = targetY - currentY;

  if (Math.abs(travelDistance) < 2) {
    setWindowScrollPosition(targetY);
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setWindowScrollPosition(targetY);
    return;
  }

  const duration =
    options.duration ??
    Math.min(950, Math.max(500, Math.abs(travelDistance) * 0.55));

  const startTime = performance.now();

  const animate = (timestamp: number) => {
    if (scrollGeneration !== activeScrollGeneration) {
      return;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    setWindowScrollPosition(currentY + travelDistance * easedProgress);

    if (progress < 1) {
      activeScrollFrameId = window.requestAnimationFrame(animate);
      return;
    }

    activeScrollFrameId = 0;
  };

  activeScrollFrameId = window.requestAnimationFrame(animate);
}
