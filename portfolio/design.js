const images = [...document.querySelectorAll('.image-open')];
const viewer = document.querySelector('.viewer');
const fullImage = document.querySelector('#viewer-image');
const caption = document.querySelector('#viewer-caption');
const count = document.querySelector('#viewer-count');
let selected = 0;
let opener = null;

function showImage(index) {
  selected = (index + images.length) % images.length;
  const source = images[selected];
  viewer.classList.remove('is-zoomed');
  fullImage.src = source.href;
  fullImage.alt = source.dataset.caption;
  caption.textContent = source.dataset.caption;
  count.textContent = `${selected + 1} / ${images.length}`;
  document.querySelector('.viewer-stage').scrollTo(0, 0);
}

if (typeof viewer.showModal === 'function') {
  images.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    showImage(index);
    viewer.showModal();
    document.body.classList.add('viewer-open');
  }));
}
document.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
document.querySelector('.viewer-prev').addEventListener('click', () => showImage(selected - 1));
document.querySelector('.viewer-next').addEventListener('click', () => showImage(selected + 1));
fullImage.addEventListener('click', () => viewer.classList.toggle('is-zoomed'));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showImage(selected + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  viewer.classList.remove('is-zoomed');
  opener?.focus({ preventScroll: true });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.work-gallery').forEach(gallery => {
  const controls = gallery.previousElementSibling.querySelector('.gallery-controls');
  const previous = controls.querySelector('[data-gallery-direction="-1"]');
  const next = controls.querySelector('[data-gallery-direction="1"]');
  controls.hidden = false;
  function updateControls() {
    const maxScroll = gallery.scrollWidth - gallery.clientWidth;
    controls.classList.toggle('is-static', maxScroll <= 2);
    previous.disabled = gallery.scrollLeft < 2;
    next.disabled = gallery.scrollLeft >= maxScroll - 2;
  }
  controls.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      gallery.scrollBy({
        left: Number(button.dataset.galleryDirection) * gallery.clientWidth * 0.8,
        behavior: reducedMotion.matches ? 'instant' : 'smooth'
      });
    });
  });
  gallery.addEventListener('scroll', updateControls, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(updateControls).observe(gallery);
  else window.addEventListener('resize', updateControls);
  updateControls();
});
