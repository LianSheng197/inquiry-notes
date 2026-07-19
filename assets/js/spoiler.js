const content = document.querySelector('.post-content');

if (content) {
  const ignoredTags = new Set(['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE']);
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!ignoredTags.has(node.parentElement?.tagName) && /\|\|[^|]+\|\|/.test(node.nodeValue)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    const parts = node.nodeValue.split(/(\|\|[^|]+\|\|)/g);

    parts.forEach((part) => {
      const match = part.match(/^\|\|([^|]+)\|\|$/);
      if (!match) {
        fragment.append(document.createTextNode(part));
        return;
      }

      const spoiler = document.createElement('span');
      spoiler.className = 'spoiler-text';
      spoiler.setAttribute('role', 'button');
      spoiler.setAttribute('tabindex', '0');
      spoiler.setAttribute('aria-pressed', 'false');
      spoiler.textContent = match[1];

      const reveal = () => {
        spoiler.classList.add('is-revealed');
        spoiler.setAttribute('aria-pressed', 'true');
      };

      spoiler.addEventListener('click', reveal);
      spoiler.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          reveal();
        }
      });

      fragment.append(spoiler);
    });

    node.replaceWith(fragment);
  });
}
