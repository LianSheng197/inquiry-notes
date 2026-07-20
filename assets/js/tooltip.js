const content = document.querySelector('.post-content');

const createTooltip = (hint) => {
  const tooltip = document.createElement('span');
  tooltip.className = 'tooltip-text';
  tooltip.setAttribute('tabindex', '0');
  tooltip.setAttribute('role', 'note');
  tooltip.dataset.hint = hint;
  return tooltip;
};

if (content) {
  const codeNodes = [...content.querySelectorAll('code')];

  codeNodes.forEach((code) => {
    const before = code.previousSibling;
    const after = code.nextSibling;
    const openIndex = before?.nodeType === Node.TEXT_NODE
      ? before.nodeValue.lastIndexOf('[[')
      : -1;
    const match = after?.nodeType === Node.TEXT_NODE
      ? after.nodeValue.match(/^\|([^\]\n]+)\]\]/)
      : null;

    if (openIndex < 0 || !match) return;

    const displayText = code.textContent;
    before.nodeValue = before.nodeValue.slice(0, openIndex);
    after.nodeValue = after.nodeValue.slice(match[0].length);

    if (displayText.trim() === match[1].trim()) return;

    const tooltip = createTooltip(match[1]);
    tooltip.append(code.cloneNode(true));
    code.replaceWith(tooltip);
  });

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

      const tooltip = createTooltip(match[2]);
      tooltip.append(document.createTextNode(match[1]));
      fragment.append(tooltip);
    });

    node.replaceWith(fragment);
  });
}
