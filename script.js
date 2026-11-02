/* ============================================================
   COSMIC HUB — script.js
   Apex Week 2 | DOM Manipulation · Form Validation · Gallery · To-Do
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. STAR FIELD GENERATOR
────────────────────────────────────────────────────────── */
(function generateStars() {
  const container = document.getElementById('stars');
  const count = 180;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --dur: ${(Math.random() * 4 + 2).toFixed(1)}s;
      --op: ${(Math.random() * 0.7 + 0.2).toFixed(2)};
      animation-delay: ${(Math.random() * 5).toFixed(1)}s;
    `;
    container.appendChild(star);
  }
})();

/* ──────────────────────────────────────────────────────────
   2. HAMBURGER MENU (mobile nav)
────────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ──────────────────────────────────────────────────────────
   3. ANIMATED STAT COUNTERS (Intersection Observer)
────────────────────────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ──────────────────────────────────────────────────────────
   4. CONTACT FORM + JS VALIDATION (Missions 01 + 02)
────────────────────────────────────────────────────────── */
const form        = document.getElementById('contactForm');
const messageArea = document.getElementById('message');
const charCountEl = document.getElementById('charCount');
const successMsg  = document.getElementById('successMsg');
const submitBtn   = form.querySelector('.btn-submit');
const MAX_CHARS   = 300;

// Live char counter
messageArea.addEventListener('input', () => {
  const len = messageArea.value.length;
  charCountEl.textContent = `${len} / ${MAX_CHARS}`;
  charCountEl.style.color = len > MAX_CHARS * 0.9 ? '#ff4d6d' : 'var(--text-dim)';
});

// Helpers
function setError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) input.classList.remove('valid');
  if (input) input.classList.toggle('invalid', !!msg);
  if (input && !msg) input.classList.add('valid');
  if (err) err.textContent = msg;
  return !!msg;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[\+\d\s\-\(\)]{7,20}$/.test(phone.trim());
}

// Validate individual fields on blur for live feedback
document.getElementById('fname').addEventListener('blur', () => {
  const v = document.getElementById('fname').value.trim();
  setError('fname', 'fnameErr', v.length < 2 ? 'First name must be at least 2 characters.' : '');
});
document.getElementById('lname').addEventListener('blur', () => {
  const v = document.getElementById('lname').value.trim();
  setError('lname', 'lnameErr', v.length < 2 ? 'Last name must be at least 2 characters.' : '');
});
document.getElementById('email').addEventListener('blur', () => {
  const v = document.getElementById('email').value.trim();
  setError('email', 'emailErr', !validateEmail(v) ? 'Enter a valid email address.' : '');
});
document.getElementById('phone').addEventListener('blur', () => {
  const v = document.getElementById('phone').value.trim();
  if (v) setError('phone', 'phoneErr', !validatePhone(v) ? 'Enter a valid phone number.' : '');
});
document.getElementById('message').addEventListener('blur', () => {
  const v = document.getElementById('message').value.trim();
  const len = v.length;
  if (len === 0) setError('message', 'messageErr', 'Message is required.');
  else if (len > MAX_CHARS) setError('message', 'messageErr', `Max ${MAX_CHARS} characters.`);
  else setError('message', 'messageErr', '');
});

// Full validation on submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();
  const agree   = document.getElementById('agree').checked;

  let hasError = false;

  hasError |= setError('fname',   'fnameErr',   fname.length < 2   ? 'First name must be at least 2 characters.'     : '');
  hasError |= setError('lname',   'lnameErr',   lname.length < 2   ? 'Last name must be at least 2 characters.'      : '');
  hasError |= setError('email',   'emailErr',   !validateEmail(email) ? 'Enter a valid email address.'              : '');

  if (phone) {
    hasError |= setError('phone', 'phoneErr', !validatePhone(phone) ? 'Enter a valid phone number.' : '');
  } else {
    document.getElementById('phoneErr').textContent = '';
  }

  const subjectEl = document.getElementById('subject');
  if (!subject) {
    subjectEl.classList.add('invalid');
    document.getElementById('subjectErr').textContent = 'Please select a subject.';
    hasError = true;
  } else {
    subjectEl.classList.remove('invalid');
    document.getElementById('subjectErr').textContent = '';
  }

  if (!message) {
    hasError |= setError('message', 'messageErr', 'Message is required.');
  } else if (message.length > MAX_CHARS) {
    hasError |= setError('message', 'messageErr', `Max ${MAX_CHARS} characters.`);
  } else {
    setError('message', 'messageErr', '');
  }

  if (!agree) {
    document.getElementById('agreeErr').textContent = 'You must agree to the Space Terms.';
    hasError = true;
  } else {
    document.getElementById('agreeErr').textContent = '';
  }

  if (hasError) return;

  // Simulate async submission
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    successMsg.classList.add('show');
    form.reset();
    charCountEl.textContent = '0 / 300';
    // Clear all valid states
    form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  }, 1800);
});

/* ──────────────────────────────────────────────────────────
   5. IMAGE GALLERY (Mission 04 - Part A)
────────────────────────────────────────────────────────── */

// Seed data — using public domain space images from NASA/Unsplash
const SEED_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80',
    caption: 'Andromeda Galaxy', tag: 'space'
  },
  {
    src: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80',
    caption: 'Crescent Moon', tag: 'space'
  },
  {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    caption: 'Circuit Board', tag: 'tech'
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    caption: 'Rocket Launch', tag: 'space'
  },
  {
    src: 'https://images.unsplash.com/photo-1547226234-61d5f0c1f46e?w=600&q=80',
    caption: 'Cosmic Art', tag: 'art'
  },
  {
    src: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600&q=80',
    caption: 'Server Rack', tag: 'tech'
  }
];

// Random placeholder images (gradient-based SVGs)
const RANDOM_PLACEHOLDERS = [
  'https://picsum.photos/seed/cosmic1/600/450',
  'https://picsum.photos/seed/cosmic2/600/450',
  'https://picsum.photos/seed/nebula3/600/450',
  'https://picsum.photos/seed/galaxy4/600/450',
  'https://picsum.photos/seed/star5/600/450',
];

let galleryItems = [...SEED_IMAGES];
let galleryFilter = 'all';

const galleryGrid  = document.getElementById('galleryGrid');
const galleryEmpty = document.getElementById('galleryEmpty');
const addImageBtn  = document.getElementById('addImageBtn');
const galleryUrl   = document.getElementById('galleryUrl');
const galleryCaption = document.getElementById('galleryCaption');

function renderGallery() {
  const filtered = galleryFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.tag === galleryFilter);

  galleryGrid.innerHTML = '';

  if (filtered.length === 0) {
    galleryEmpty.style.display = 'block';
    return;
  }
  galleryEmpty.style.display = 'none';

  filtered.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.dataset.tag = item.tag;

    card.innerHTML = `
      <img src="${item.src}" alt="${item.caption}" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/${Date.now()}/600/450'"/>
      <div class="gallery-card-overlay">
        <span class="gallery-tag-badge">${item.tag}</span>
        <p class="gallery-caption">${item.caption}</p>
      </div>
      <button class="gallery-remove" title="Remove image">✕</button>
    `;

    // Find real index for removal
    const realIndex = galleryItems.indexOf(item);
    card.querySelector('.gallery-remove').addEventListener('click', () => {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      setTimeout(() => {
        galleryItems.splice(realIndex, 1);
        renderGallery();
      }, 300);
    });

    galleryGrid.appendChild(card);
  });
}

addImageBtn.addEventListener('click', () => {
  const url     = galleryUrl.value.trim();
  const caption = galleryCaption.value.trim() || 'My Image';
  const tags    = ['space', 'tech', 'art'];
  const randomTag = tags[Math.floor(Math.random() * tags.length)];

  const finalUrl = url || RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)];

  galleryItems.unshift({ src: finalUrl, caption, tag: randomTag });
  galleryUrl.value = '';
  galleryCaption.value = '';
  renderGallery();
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    galleryFilter = btn.dataset.filter;
    renderGallery();
  });
});

// Also trigger add on Enter in inputs
[galleryUrl, galleryCaption].forEach(input => {
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addImageBtn.click(); });
});

renderGallery();

// Helper: escape HTML to prevent XSS
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ──────────────────────────────────────────────────────────
   7. NAVBAR — highlight on scroll
────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => scrollObserver.observe(s));

/* ──────────────────────────────────────────────────────────
   8. SMOOTH REVEAL ANIMATIONS (Intersection Observer)
────────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.grid-card, .form-wrapper, .todo-container');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});
