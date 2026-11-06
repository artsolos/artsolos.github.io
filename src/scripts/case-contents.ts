/** Marks the case chapter currently being read in "In this project" (aria-current). */
export function initCaseContents(signal: AbortSignal) {
  const chapters = [...document.querySelectorAll<HTMLAnchorElement>('.case .contents a[href^="#"]')]
    .flatMap(link => {
      const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      return heading ? [{ link, heading }] : [];
    });
  if (!chapters.length) return;

  let active = chapters.find(({ link }) => link.hasAttribute('aria-current'))?.link;
  let frame = 0;
  let readingLine = 0;
  const mark = () => {
    frame = 0;
    let current = chapters[0];
    for (const chapter of chapters) {
      if (chapter.heading.getBoundingClientRect().top <= readingLine) current = chapter;
    }
    if (active === current.link) return;
    active?.removeAttribute('aria-current');
    active = current.link;
    active.setAttribute('aria-current', 'location');
  };
  const schedule = () => {
    if (!frame && !signal.aborted) frame = requestAnimationFrame(mark);
  };
  const measure = () => {
    // A chapter reached by an anchor must count even in a short viewport.
    const anchorOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    readingLine = Math.max(anchorOffset + 2, Math.min(innerHeight * .3, 140));
    schedule();
  };

  addEventListener('scroll', schedule, { passive: true, signal });
  addEventListener('hashchange', schedule, { signal });
  addEventListener('resize', measure, { signal });
  signal.addEventListener('abort', () => cancelAnimationFrame(frame));
  measure();
}
