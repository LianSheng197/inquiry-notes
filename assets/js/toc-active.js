const toc = document.querySelector('.post-toc');

if (toc) {
  const links = [...toc.querySelectorAll('#TableOfContents a[href^="#"]')];
  const headings = links
    .map((link) => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      return document.querySelector(`#${CSS.escape(id)}`);
    })
    .filter(Boolean);

  if (headings.length) {
    const keepLinkVisible = (link) => {
      if (toc.scrollHeight <= toc.clientHeight) return;

      const tocRect = toc.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const edgeSpacing = 12;
      const visibleTop = tocRect.top + edgeSpacing;
      const visibleBottom = tocRect.bottom - edgeSpacing;

      if (linkRect.top < visibleTop) {
        toc.scrollTop -= visibleTop - linkRect.top;
      } else if (linkRect.bottom > visibleBottom) {
        toc.scrollTop += linkRect.bottom - visibleBottom;
      }
    };

    const setActive = (index) => {
      links.forEach((link, linkIndex) => {
        const active = linkIndex === index;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });

      keepLinkVisible(links[index]);
    };

    const updateActive = () => {
      const headerOffset = 96;
      let activeIndex = 0;

      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= headerOffset) activeIndex = index;
      });

      setActive(activeIndex);
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateActive();
  }
}
