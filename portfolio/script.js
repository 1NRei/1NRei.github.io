// Add only the owner's confirmed public contact details here.
const CONTACTS = Object.freeze({ email: 'ray.nika64@gmail.com', telegram: 'https://t.me/qewvy' });
const isEnglish = document.documentElement.lang === 'en';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  reduceMotion.addEventListener('change', (event) => {
    if (event.matches) {
      observer.disconnect();
      document.documentElement.classList.remove('js');
    }
  });
}

const poster = document.querySelector('.poster');
const modeStatus = document.querySelector('#mode-status');
document.querySelectorAll('.modes button').forEach((button) => {
  button.addEventListener('click', () => {
    poster.dataset.mode = button.dataset.mode;
    document.querySelectorAll('.modes button').forEach((other) => {
      other.setAttribute('aria-pressed', String(other === button));
    });
    const description = isEnglish ? `Layout: ${button.textContent}.` : `Композиция: ${button.textContent}.`;
    poster.setAttribute('aria-label', isEnglish ? `Veronika Nikiforova’s typographic poster. ${description}` : `Именная афиша Вероники Никифоровой. ${description}`);
    modeStatus.textContent = description;
  });
});

document.querySelectorAll('[data-contact]').forEach((button) => {
  const type = button.dataset.contact;
  const value = CONTACTS[type];
  if (value) {
    const link = document.createElement('a');
    link.className = button.className;
    link.innerHTML = button.innerHTML;
    link.href = type === 'email' ? `mailto:${value}` : value;
    if (type === 'telegram') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    button.replaceWith(link);
  } else {
    button.addEventListener('click', () => {
      const notice = document.querySelector('#contact-notice');
      notice.hidden = false;
      notice.textContent = isEnglish ? (type === 'email' ? 'The email address has not been published yet.' : 'The Telegram link has not been published yet.') : type === 'email'
        ? 'Адрес почты пока не опубликован. Контакты появятся здесь после обновления сайта.'
        : 'Ссылка на Telegram пока не опубликована. Контакты появятся здесь после обновления сайта.';
    });
  }
});
