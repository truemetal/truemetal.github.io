const viewedSections = new Set();
const engagedSections = new Set();
const engagementTime = 5000;

export function startSectionAnalytics() {
  if (typeof window.gtag !== 'function') return;

  const sections = [...document.querySelectorAll('[data-analytics-section]')].map(element => ({
    element,
    name: element.dataset.analyticsSection,
    elapsed: 0,
    activeSince: null,
  }));
  const header = document.querySelector('.site-header');
  let focused = document.hasFocus();
  let pageActive = true;
  let timer;
  let frame;

  function update() {
    window.clearTimeout(timer);
    const now = window.performance.now();
    const top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
    const viewportHeight = Math.max(0, window.innerHeight - top);
    const active = pageActive && !document.hidden && focused;
    let remaining = Infinity;

    for (const section of sections) {
      if (section.activeSince !== null) section.elapsed += now - section.activeSince;
      section.activeSince = null;

      const rect = section.element.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, top));
      // Measure against the smaller of the section and viewport, including tall sections.
      const visible = active && viewportHeight > 0 && rect.height > 0 && rect.width > 0
        && visibleHeight >= Math.min(rect.height, viewportHeight) / 2;
      if (!visible) continue;

      if (!viewedSections.has(section.name)) {
        viewedSections.add(section.name);
        window.gtag('event', 'section_view', { section_name: section.name });
      }
      if (engagedSections.has(section.name)) continue;
      if (section.elapsed >= engagementTime) {
        engagedSections.add(section.name);
        window.gtag('event', 'section_engaged', { section_name: section.name });
      } else {
        section.activeSince = now;
        remaining = Math.min(remaining, engagementTime - section.elapsed);
      }
    }
    if (remaining < Infinity) timer = window.setTimeout(update, remaining);
  }

  function schedule() {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(update);
  }
  function focus() { focused = true; update(); }
  function blur() { focused = false; update(); }
  function hide() { pageActive = false; update(); }
  function show() { pageActive = true; focused = document.hasFocus(); update(); }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('focus', focus);
  window.addEventListener('blur', blur);
  window.addEventListener('pagehide', hide);
  window.addEventListener('pageshow', show);
  document.addEventListener('visibilitychange', update);
  const observer = new ResizeObserver(schedule);
  sections.forEach(({ element }) => observer.observe(element));
  if (header) observer.observe(header);
  update();

  return () => {
    window.clearTimeout(timer);
    window.cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('focus', focus);
    window.removeEventListener('blur', blur);
    window.removeEventListener('pagehide', hide);
    window.removeEventListener('pageshow', show);
    document.removeEventListener('visibilitychange', update);
  };
}
