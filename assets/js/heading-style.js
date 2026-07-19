const headings = document.querySelectorAll('.post-content h3');

const updateHeadingWidths = () => {
  headings.forEach((heading) => {
    const range = document.createRange();
    range.selectNodeContents(heading);

    const textWidth = [...range.getClientRects()]
      .reduce((width, rect) => Math.max(width, rect.width), 0);

    heading.style.setProperty('--h3-text-width', `${textWidth}px`);
  });
};

if (headings.length) {
  updateHeadingWidths();
  window.addEventListener('resize', updateHeadingWidths);
}
