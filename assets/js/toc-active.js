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
    const setActive = (index) => {
      links.forEach((link, linkIndex) => {
        const active = linkIndex === index;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
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
