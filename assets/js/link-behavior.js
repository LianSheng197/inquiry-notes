document.querySelectorAll('a[href]').forEach((link) => {
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});
