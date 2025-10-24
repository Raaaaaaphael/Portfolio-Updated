// script.js - smooth scroll, modal, lazy media, skill animation
document.addEventListener('DOMContentLoaded', () => {
  // set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', href);
      }
    });
  });

  /* ---- Modal / project gallery ---- */
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const modalHint = document.getElementById('modalHint');
  const modalClose = document.getElementById('modalClose');

  function openModal(title, contentNode, hintText = '') {
    modalTitle.textContent = title || '';
    modalContent.innerHTML = '';
    modalContent.appendChild(contentNode);
    modalHint.textContent = hintText;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    // pause any videos
    const v = modalContent.querySelector('video');
    if (v && !v.paused) try { v.pause(); } catch(e){}
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    modalHint.textContent = '';
    document.body.style.overflow = '';
  }

  modalClose && modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.open-project').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const src = btn.dataset.src || '';
      const title = btn.dataset.title || '';

      if (type === 'image') {
        const parts = src.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length === 0) return;
        if (parts.length === 1) {
          const img = document.createElement('img');
          img.loading = 'lazy';
          img.src = parts[0];
          img.alt = title;
          openModal(title, img);
        } else {
          // simple click-to-advance gallery
          let idx = 0;
          const img = document.createElement('img');
          img.loading = 'lazy';
          img.src = parts[idx];
          img.alt = title;
          img.style.cursor = 'pointer';
          img.addEventListener('click', () => {
            idx = (idx + 1) % parts.length;
            img.src = parts[idx];
          });
          const wrapper = document.createElement('div');
          wrapper.appendChild(img);
          const hint = 'Click image to view next';
          openModal(title, wrapper, hint);
        }
      } else if (type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        const source = document.createElement('source');
        source.src = src;
        video.appendChild(source);
        video.addEventListener('loadedmetadata', () => {
          try { video.play().catch(()=>{}); } catch(e){}
        });
        openModal(title, video);
      }
    });
  });

  /* ---- Skill bar animation on scroll ---- */
  const skillBars = document.querySelectorAll('.skill-bar');
  if ('IntersectionObserver' in window && skillBars.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const value = parseInt(bar.dataset.value || "0", 10);
          const fill = bar.querySelector('.skill-fill');
          if (fill) {
            requestAnimationFrame(() => {
              fill.style.width = value + '%';
            });
          }
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach(b => io.observe(b));
  } else {
    skillBars.forEach(b => {
      const value = parseInt(b.dataset.value || "0", 10);
      const fill = b.querySelector('.skill-fill');
      if (fill) fill.style.width = value + '%';
    });
  }

  /* reduce motion respect */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
});
