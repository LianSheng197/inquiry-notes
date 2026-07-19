const dialog = document.querySelector('#image-lightbox');
const preview = document.querySelector('#image-lightbox-image');

if (dialog && preview) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-image-preview]');
    if (!link) return;

    event.preventDefault();
    preview.src = link.href;
    preview.alt = link.dataset.imageAlt || '';

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('.image-lightbox-close')) dialog.close();
  });

  dialog.addEventListener('close', () => preview.removeAttribute('src'));
}
