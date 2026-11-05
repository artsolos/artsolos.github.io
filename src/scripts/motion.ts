// Scroll reveals: elements with .reveal fade/slide in once when they enter the
// viewport. The hidden start state only exists under html.motion (set in the head
// when JS runs and reduced motion is not requested), so content is never lost.
declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const root = document.documentElement;
window.__motionReady = true;

if (root.classList.contains('motion')) {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));

  // If the user switches to reduced motion mid-visit, show everything immediately.
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      root.classList.remove('motion');
      io.disconnect();
    }
  });
}

export {};
