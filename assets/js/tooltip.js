const content = document.querySelector('.post-content');

if (content) {
  const ignoredTags = new Set(['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE']);
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!ignoredTags.has(node.parentElement?.tagName) && /\[\[[^\]|\n]+\|[^\]]+\]\]/.test(node.nodeValue)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    const parts = node.nodeValue.split(/(\[\[[^\]|\n]+\|[^\]]+\]\])/g);

    parts.forEach((part) => {
      const match = part.match(/^\[\[([^\]|\n]+)\|([^\]]+)\]\]$/);
      if (!match) {
        fragment.append(document.createTextNode(part));
        return;
      }

      if (match[1].trim() === match[2].trim()) {
        fragment.append(document.createTextNode(match[1]));
        return;
      }

      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip-text';
      tooltip.setAttribute('tabindex', '0');
      tooltip.setAttribute('role', 'note');
      tooltip.dataset.hint = match[2];
      tooltip.textContent = match[1];
      fragment.append(tooltip);
    });

    node.replaceWith(fragment);
  });
}
