const links = document.querySelectorAll('a[href]');
const webProtocols = new Set(['http:', 'https:']);

links.forEach((link) => {
  const url = new URL(link.href, window.location.href);
  const isExternal = webProtocols.has(url.protocol) && url.origin !== window.location.origin;

  link.classList.toggle('is-external', isExternal);

  if (isExternal) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return;
  }

  link.removeAttribute('target');
  link.removeAttribute('rel');
});
